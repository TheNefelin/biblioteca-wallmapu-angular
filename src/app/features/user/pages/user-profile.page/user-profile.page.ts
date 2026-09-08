import { LoggerService } from '@core/services/logger-service';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { UserService } from '@features/user/services/user-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { catchError, map, of } from 'rxjs';
import { UserProfileComponent } from "@features/user/components/user-profile-component/user-profile-component";
import { NotificationListComponent } from "@features/notification/components/notification-list-component/notification-list-component";
import { AuthUser } from '@features/auth/models/auth-user';
import { Role } from '@shared/constants/roles-enum';
import { NotificationService } from '@features/notification/services/notification-service';
import { PaginationRequestModel } from '@shared/models/pagination-request-model';
import { NotificationFilterModel, NotificationModel } from '@features/notification/models/notification-model';
import { NotificationBadgeState } from '@features/notification/services/notification-badge-state.service';
import { NotificationBellComponent } from "@features/notification/components/notification-bell-component/notification-bell-component";
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { CrudPage } from '@shared/base/crud-page';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { UserModel } from '@features/user/models/user-model';

@Component({
  selector: 'app-user-profile.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    UserProfileComponent,
    NotificationListComponent,
    NotificationBellComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-profile.page.html',
})
export class UserProfilePage extends CrudPage<NotificationModel> {
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);
  private readonly mutation = inject(MutationService);

  // SERVICES -----------------------------------------------------------------------
  private readonly authStore = inject(AuthStore);
  readonly authUser = computed<AuthUser | null>(() => this.authStore.user());

  private readonly badgeState = inject(NotificationBadgeState);
  readonly unreadCount = this.badgeState.unreadCount;

  private readonly notificationService = inject(NotificationService);
  protected readonly getNotificationPayload = computed<PaginationRequestModel<NotificationFilterModel>>(() => ({
    page: this.currentPage(),
    limit: this.limit(),
    search: this.search(),
    filter: {
      is_read: this.showOnlyUnread(),
    }
  }));
  protected readonly notification = {
    dataList: computed<NotificationModel[]>(() => this.getAllNotificationRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllNotificationRX.isLoading()),
    isSaving: signal<boolean>(false),
  };
  protected readonly showOnlyUnread = signal<boolean>(false);

  private readonly userService = inject(UserService);
  protected readonly user = computed<UserModel | null>(() => this.getUserRX.value() ?? null);
  protected readonly isProfileIncomplete = computed(() => {
    const user = this.user();
    if (!user) return false;

    return !(user.name && user.lastname && user.address && user.rut && user.phone);
  });

  private readonly confirmService = inject(ModalConfirmService);
  private profileWarningShown = false;
  private readonly profileWarning = effect(() => {
    if (this.isProfileIncomplete() && !this.profileWarningShown) {
      this.profileWarningShown = true;
      void this.confirmService.confirm({
        title: 'Perfil incompleto',
        message: 'Debes completar tu perfil para acceder a todas las funcionalidades.',
      }).then(confirmed => {
        if (confirmed) {
          this.onNavigateToEdit();
        }
      });
    }
  });

  // FETCHS ------------------------------------------------------------------------
  private readonly getUserRX = rxResource({
    params: () => this.authUser(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.userService.getById(params.id_user).pipe(
        catchError(err => {
          this.logger.error('UserService::UserProfilePage', 'getById', err);
          return of(null);
        })
      );
    },
  });

  private readonly getAllNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => {
      if (!params) return of(this.emptyPaginated());

      return this.notificationService.getAllPaginationByUser(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          this.logger.error('NotificationService::UserProfilePage', 'getAllPaginationByUser', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllNotificationRX.reload();
  }

  // NOTIFICATION ACTIONS ----------------------------------------------------------
  protected onFilterNotRead(showOnlyUnread: boolean): void {
    this.showOnlyUnread.set(showOnlyUnread);
    this.currentPage.set(1);
  }

  protected onMarkAsRead(item: NotificationModel): void {
    this.mutation.run(
      this.notificationService.markAsReadByUser(item.id_notification),
      { isSaving: this.notification.isSaving },
      {
        successMsg: 'Notificación marcada como leída',
        errorMsg: 'Error al marcar la notificación como leída',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected onMarkAllAsRead(): void {
    this.mutation.run(
      this.notificationService.markAllAsReadByUser(),
      { isSaving: this.notification.isSaving },
      {
        successMsg: 'Todas las notificaciones marcadas como leídas',
        errorMsg: 'Error al marcar todas las notificaciones como leídas',
        onSuccess: () => this.reload(),
      }
    );
  }

  // PROFILE ACTIONS ----------------------------------------------------------------
  protected onNavigateToEdit(): void {
    const id_user = this.user()?.id_user;
    const isAdmin = this.authUser()?.role == Role.Admin;

    if (id_user) {
      const formRoute = isAdmin
        ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.FORM(id_user)
        : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.FORM(id_user);

      this.router.navigate([formRoute]);
    }
  }
}