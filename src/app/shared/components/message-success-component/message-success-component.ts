import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-message-success-component',
  imports: [],
  templateUrl: './message-success-component.html',
})
export class MessageSuccessComponent {
  readonly message = input<string | null>("Success");
}
