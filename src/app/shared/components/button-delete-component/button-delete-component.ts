import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button-delete-component',
  imports: [],
  templateUrl: './button-delete-component.html',
})
export class ButtonDeleteComponent {
  protected readonly clicked = output<void>();
}
