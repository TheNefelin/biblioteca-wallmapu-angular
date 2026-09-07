import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-message-error-component',
  imports: [],
  templateUrl: './message-error-component.html',
})
export class MessageErrorComponent {
  readonly message = input<string | null>("Error");
}
