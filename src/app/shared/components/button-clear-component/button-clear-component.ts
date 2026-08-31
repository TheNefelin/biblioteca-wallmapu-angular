import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button-clear-component',
  imports: [],
  templateUrl: './button-clear-component.html',
})
export class ButtonClearComponent {
  protected readonly clicked = output<void>();
}
