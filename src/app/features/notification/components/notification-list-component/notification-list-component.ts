import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NotificationDetailModel } from '@features/notification/models/notification-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { PaginationComponent } from '@shared/components/pagination-component/pagination-component';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';

@Component({
  selector: 'app-notification-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ButtonComponent,
    PaginationComponent,
    LoadingComponent,
  ],
  templateUrl: './notification-list-component.html',
})
export class NotificationListComponent {
  readonly isLoading = input<boolean>(false);
  readonly isUser = input<boolean>(false);
  readonly showOnlyUnread = input<boolean>(false);
  readonly notificationList = input<NotificationDetailModel[]>([]);
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  protected readonly reload = output<void>();
  protected readonly markAsRead = output<NotificationDetailModel>();
  protected readonly markAllAsRead = output<void>();
  protected readonly filterNotRead = output<boolean>();
  protected readonly nextPage = output<void>();
  protected readonly prevPage = output<void>();
  protected readonly sendNotification = output<void>();

  protected handleFilterNotReadChange(event: Event): void {
    this.filterNotRead.emit((event.target as HTMLInputElement).checked);
  }
}