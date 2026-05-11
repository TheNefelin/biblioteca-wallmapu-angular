import { DatePipe } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NotificationDetailModel } from '@features/notification/models/notification-model';
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonNotificationComponent } from "@shared/components/button-notification-component/button-notification-component";

@Component({
  selector: 'app-notification-list-components',
  imports: [
    DatePipe,
    ButtonRefreshComponent,
    PaginationComponent,
    LoadingComponent,
    ButtonNotificationComponent
],
  templateUrl: './notification-list-components.html',
})
export class NotificationListComponents {
  readonly isLoading = input<boolean>(false);
  readonly isUser = input<boolean>(false)
  readonly paginationAndNotificationList = input<PaginationResponseModel<NotificationDetailModel[]> | null>(null);
  protected readonly onReload = output<void>();
  protected readonly onMarkAsRead = output<NotificationDetailModel>();
  protected readonly onMarkAllAsRead = output<void>();
  protected readonly onFilterNotRead = output<boolean>();
  protected readonly onNextPage = output<void>();
  protected readonly onPrevPage = output<void>();
  
  protected readonly totalPages = signal<number>(1);
  
  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationAndNotificationList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });

  protected handleCheckboxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.onFilterNotRead.emit(!checked);
  }
}
