import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button-search-component',
  imports: [],
  templateUrl: './button-search-component.html',
})
export class ButtonSearchComponent {
  protected readonly clicked = output<void>();
}
