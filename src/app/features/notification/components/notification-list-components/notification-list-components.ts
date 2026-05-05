import { DatePipe, JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NotificationModel } from '@features/notification/models/notification-model';
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonNotificationComponent } from "@shared/components/button-notification-component/button-notification-component";

@Component({
  selector: 'app-notification-list-components',
  imports: [
    JsonPipe,
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
  readonly paginationAndNotificationList = input<PaginationResponseModel<NotificationModel[]> | null>(null);
}
