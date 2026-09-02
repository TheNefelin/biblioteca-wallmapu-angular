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
  protected readonly clicked = output<void>();

  protected btnClick(event: Event): void {
    // El botón genérico no previene el default; el comportamiento del click
    // (submit, dialog, enlace) lo gestiona el consumidor vía `type="button"` y su propio handler.
    // event.preventDefault();
    this.clicked.emit();
  }
}