import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

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
  | 'download'
  | 'book'
  | 'expire';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-button-component',
  imports: [],
  templateUrl: './button-component.html',
})
export class ButtonComponent {
  readonly icon = input<ButtonIcon>('create');
  readonly textBtn = input<string>('');
  readonly isOpen = input<boolean>(true);
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit'>('button');
  protected readonly clicked = output<void>();
}