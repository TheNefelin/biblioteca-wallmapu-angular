import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-edit-component',
  imports: [],
  templateUrl: './button-edit-component.html',
})
export class ButtonEditComponent {
  readonly textBtn = input<string>("")
  protected readonly onClick = output<void>();
}
