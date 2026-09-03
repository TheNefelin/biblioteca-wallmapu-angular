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
  | 'notification'
  | 'help'
  | 'download';

@Component({
  selector: 'app-button-component',
  imports: [],
  templateUrl: './button-component.html',
})
export class ButtonComponent {
  readonly icon = input<ButtonIcon>('create');
  readonly textBtn = input<string>('');
  readonly isOpen = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  protected readonly clicked = output<void>();
}