import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notification-bell-component',
  imports: [],
  templateUrl: './notification-bell-component.html',
})
export class NotificationBellComponent {
  readonly textUnreadCount = input<number>(0);
}