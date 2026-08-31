import { Component, input, output } from '@angular/core';

export type ButtonIcon =
  | 'create'
  | 'edit'
  | 'delete'
  | 'clear'
  | 'cancel'
  | 'refresh'
  | 'search'
  | 'save'
  | 'goto'
  | 'barcode'
  | 'notification';

@Component({
  selector: 'app-button-component',
  imports: [],
  templateUrl: './button-component.html',
})
export class ButtonComponent {
  readonly icon = input<ButtonIcon>('create');
  readonly textBtn = input<string>('');
  readonly isOpen = input<boolean>(true);
  protected readonly clicked = output<void>();

  protected btnClick(event: Event): void {
    event.preventDefault();
    this.clicked.emit();
  }
}