import { Component, computed, inject, signal } from '@angular/core';
import { UserStatsComponents } from "@features/stats/components/user-stats-components/user-stats-components";
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationService } from '@features/notification/services/notification-service';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NotificationDetailModel, NotificationFilterModel } from '@features/notification/models/notification-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { catchError, EMPTY, finalize, map, of } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-user-dashboard-page',
  imports: [
    UserStatsComponents,
    NotificationListComponents,
    MessageErrorComponent,
  ],
  templateUrl: './user-dashboard-page.html',
})
export class UserDashboardPage {
  protected readonly isReadFilter = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoadingMarkAsRead = signal(false);
  protected readonly isLoadingMarkAllAsRead = signal(false);
  protected readonly isLoading = computed<boolean>(() => this.getNotificationRX.isLoading() || this.isLoadingMarkAsRead() || this.isLoadingMarkAllAsRead());

  private readonly notificationService = inject(NotificationService);
  private readonly getNotificationPayload = computed<PaginationRequestModel<NotificationFilterModel>>(() => {
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
  
  private readonly getNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => { 

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

  protected onMarkAsRead(item: NotificationDetailModel): void {
    this.isLoadingMarkAsRead.set(true);

    this.notificationService.markAsReadByUser(item.id_notification)
      .pipe(
        catchError(err => {
          this.handleError(err);
          return EMPTY;
        }),
        finalize(() => this.isLoadingMarkAsRead.set(false))
      )
      .subscribe(() => {
        this.getNotificationRX.reload();
      });
  }

  protected onMarkAllAsRead(): void {
    this.isLoadingMarkAllAsRead.set(true);

    this.notificationService.markAllAsReadByUser()
      .pipe(
        catchError(err => {
          this.handleError(err);
          return EMPTY;
        }),
        finalize(() => this.isLoadingMarkAllAsRead.set(false))
      )
      .subscribe(() => {
        this.getNotificationRX.reload();
      });
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

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
  }
}
