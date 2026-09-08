import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UserStatsComponent } from "@features/stats/components/user-stats-component/user-stats-component";
import { NotificationListComponent } from "@features/notification/components/notification-list-component/notification-list-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationService } from '@features/notification/services/notification-service';
import { NotificationFilterModel, NotificationModel } from '@features/notification/models/notification-model';
import { PaginationRequestModel } from '@shared/models/pagination-request-model';
import { catchError, map, of } from 'rxjs';
import { CrudPage } from '@shared/base/crud-page';
import { MutationService } from '@core/services/mutation-service';

@Component({
  selector: 'app-user-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserStatsComponent,
    NotificationListComponent,
  ],
  templateUrl: './user-dashboard-page.html',
})
export class UserDashboardPage extends CrudPage<NotificationModel> {
  private readonly notificationService = inject(NotificationService);
  private readonly mutation = inject(MutationService);

  // NOTIFICATION STATE -------------------------------------------------------------
  protected readonly showOnlyUnread = signal<boolean>(false);
  protected readonly markAsReadSaving = signal<boolean>(false);
  protected readonly markAllAsReadSaving = signal<boolean>(false);

  protected readonly notification = {
    dataList: computed<NotificationModel[]>(() => this.getAllNotificationRX.value() ?? []),
    isLoading: computed<boolean>(() =>
      (this.getAllNotificationRX.isLoading() && !this.getAllNotificationRX.hasValue()) ||
      this.markAsReadSaving() ||
      this.markAllAsReadSaving()
    ),
  };

  // FETCHS ------------------------------------------------------------------------
  private readonly getNotificationPayload = computed<PaginationRequestModel<NotificationFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        is_read: this.showOnlyUnread()
      }
    }
  });

  private readonly getAllNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.notificationService.getAllPaginationByUser(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[NotificationService::UserDashboardPage] getAllPaginationByUser:', err);
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
      { isSaving: this.markAsReadSaving },
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
      { isSaving: this.markAllAsReadSaving },
      {
        successMsg: 'Todas las notificaciones marcadas como leídas',
        errorMsg: 'Error al marcar todas las notificaciones como leídas',
        onSuccess: () => this.reload(),
      }
    );
  }
}