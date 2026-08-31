import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button-refresh-component',
  imports: [],
  templateUrl: './button-refresh-component.html',
})
export class ButtonRefreshComponent {
  protected readonly clicked = output<void>();
}
