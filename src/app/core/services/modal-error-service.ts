import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalErrorService {
  private _isOpen = signal(false);
  private _statusCode = signal<number | null>(null);
  private _message = signal<string>('');
  private _action: (() => void) | null = null; // ⚡ acción al hacer click

  isOpen = this._isOpen.asReadonly();
  statusCode = this._statusCode.asReadonly();
  message = this._message.asReadonly();

  // Abre el modal y opcionalmente asigna una acción al botón
  openError(status: number, message: string, action?: () => void) {
    this._statusCode.set(status);
    this._message.set(message);
    this._action = action ?? null;
    this._isOpen.set(true);
  }

  // Cierra el modal y ejecuta la acción si existe
  close() {
    this._isOpen.set(false);
    if (this._action) {
      this._action();
      this._action = null;
    }
  }
}
