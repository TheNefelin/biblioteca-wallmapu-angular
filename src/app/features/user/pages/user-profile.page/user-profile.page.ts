import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { UserService } from '@features/user/services/user-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { catchError, map, of, tap } from 'rxjs';
import { UserProfileComponents } from "@features/user/components/user-profile-components/user-profile-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";
import { UserDetailModel } from '@features/user/models/user-model';
import { AuthUser } from '@features/auth/models/auth-user';
import { Role } from '@shared/constants/roles-enum';
import { extractErrorMessage } from '@core/utils/error-handler';
import { NotificationService } from '@features/notification/services/notification-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { NotificationDetailModel, NotificationFilterModel } from '@features/notification/models/notification-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NotificationBadgeState } from '@features/notification/services/notification-badge-state.service';
import { NotificationBellComponents } from "@features/notification/components/notification-bell-components/notification-bell-components";
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-profile.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    UserProfileComponents,
    MessageErrorComponent,
    NotificationListComponents,
    NotificationBellComponents
],
  templateUrl: './user-profile.page.html',
})
export class UserProfilePage {
  private readonly badgeState = inject(NotificationBadgeState);
  readonly unreadCount = this.badgeState.unreadCount;
  
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  readonly authUser = computed<AuthUser | null>(() => this.authStore.user());

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isReadFilter = signal<boolean>(true);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getUserRX,
      this.getNotificationRX,
      this.markNotificationAsReadRX,
      this.markAllNotificationAsReadRX,
    ].some(e => e.isLoading())
  );

  private readonly notificationService = inject(NotificationService);
  private readonly markAsReadPayload = signal<number | null>(null);
  private readonly markAllReadTrigger = signal<number>(0);
  private readonly getNotificationPayload = computed<PaginationRequestModel<NotificationFilterModel>>(() => {
    const user = this.authUser();
    if (!user) return null as any;
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        is_read: this.isReadFilter()
      }
    }
  });
  protected readonly computedPaginationAndNotificationList = computed<PaginationResponseModel<NotificationDetailModel[]> | null>(() => this.getNotificationRX.value() ?? null);
  
  private readonly userService = inject(UserService);
  readonly userDetailComputed = computed<UserDetailModel | null>(() => this.getUserRX.value() ?? null);
  readonly isProfileIncomplete = computed(() => {
    const user = this.getUserRX.value();
    if (!user) return false;
  
    return !(user.name && user.lastname && user.address && user.rut && user.phone);
  });

  private readonly getUserRX = rxResource({
    params: () => this.authUser(),
    stream: ({ params }) => {
      if (!params) return of(null);
  
      return this.userService.getById(params.id_user).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly getNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.notificationService.getAllPaginationByUser(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly markNotificationAsReadRX = rxResource({
    params: () => this.markAsReadPayload(),
    stream: ({ params }) => { 
      if (!params) return of(null);

      return this.notificationService.markAsReadByUser(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.getNotificationRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly markAllNotificationAsReadRX = rxResource({
    params: () => this.markAllReadTrigger(),
    stream: ({ params }) => { 
      if (!params) return of(null);

      return this.notificationService.markAllAsReadByUser().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.getNotificationRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });  

  protected onMarkAsRead(item: NotificationDetailModel): void {
    this.markAsReadPayload.set(item.id_notification)
  }

  protected onMarkAllAsRead(): void {
    this.markAllReadTrigger.update(c => c + 1);
  }
  
  protected onFilterNotRead(is_read: boolean): void {
    this.isReadFilter.set(is_read);
  }

  protected onReloadNotification(): void {
    this.getNotificationRX.reload();
  }

  protected nextPage(): void {
    const totalPages = this.computedPaginationAndNotificationList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }
  
  protected onNavigateToEdit(): void {
    const id_user = this.userDetailComputed()?.id_user;
    const isAdmin = this.authUser()?.role == Role.Admin;

    if (id_user) {
      const formRoute = isAdmin
        ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.FORM(id_user)
        : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.FORM(id_user);

      this.router.navigate([formRoute]);
    }
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
  }
}
