import { Component, computed, inject, signal } from '@angular/core';
import { UserStatsComponents } from "@features/stats/components/user-stats-components/user-stats-components";
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificationService } from '@features/notification/services/notification-service';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NotificationModel } from '@features/notification/models/notification-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-user-dashboard-page',
  imports: [
    UserStatsComponents, 
    NotificationListComponents,
  ],
  templateUrl: './user-dashboard-page.html',
})
export class UserDashboardPage {
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() => this.getNotificationRX.isLoading());

  private readonly notificationService = inject(NotificationService);
  private readonly getNotificationPayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: null
    }
  });
  protected readonly computedPaginationAndNotificationList = computed<PaginationResponseModel<NotificationModel[]> | null>(() => this.getNotificationRX.value() ?? null);
  
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

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.errorMessage.set(message);
  }
}
