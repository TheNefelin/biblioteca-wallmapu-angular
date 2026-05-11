import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notification-bell-components',
  imports: [],
  templateUrl: './notification-bell-components.html',
})
export class NotificationBellComponents {
  readonly textUnreadCount = input<number>(0);
}
