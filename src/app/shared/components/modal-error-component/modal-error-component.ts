import { Component, inject } from '@angular/core';
import { ModalErrorService } from '@core/services/modal-error-service';

@Component({
  selector: 'app-modal-error-component',
  imports: [],
  templateUrl: './modal-error-component.html',
})
export class ModalErrorComponent {
  private modal = inject(ModalErrorService);

  isOpen = this.modal.isOpen;
  statusCode = this.modal.statusCode;
  message = this.modal.message;

  protected click(): void {
    this.modal.close(); // ⚡ cierra y ejecuta acción automáticamente
  }
}
