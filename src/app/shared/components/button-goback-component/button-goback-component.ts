import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-goback-component',
  imports: [],
  templateUrl: './button-goback-component.html',
})
export class ButtonGobackComponent {
  readonly textBtn = input<string>("")
  protected readonly clicked = output<void>();
}
