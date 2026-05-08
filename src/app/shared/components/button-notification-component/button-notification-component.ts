import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-notification-component',
  imports: [],
  templateUrl: './button-notification-component.html',
})
export class ButtonNotificationComponent {
  readonly isOpen = input<boolean>(true);
  readonly textBtn = input<string>("")
  protected readonly onClick = output<void>();
}
