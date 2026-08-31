import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { ModalConfirmService } from '@core/services/modal-confirm-service';

@Component({
  selector: 'app-modal-confirm-component',
  imports: [
    ButtonComponent,
  ],
  templateUrl: './modal-confirm-component.html',
})
export class ModalConfirmComponent {
  private service = inject(ModalConfirmService);

  dialog = this.service.dialog;

  protected confirm(): void {
    this.service.accept();
  }

  protected closed(): void {
    this.service.reject();
  }
}
