import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notification-bell-component',
  imports: [],
  templateUrl: './notification-bell-component.html',
})
export class NotificationBellComponent {
  readonly textUnreadCount = input<number>(0);
}