import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-create-component',
  imports: [],
  templateUrl: './button-create-component.html',
})
export class ButtonCreateComponent {
  readonly textBtn = input<string>("")
  protected readonly clicked = output<void>();
}
