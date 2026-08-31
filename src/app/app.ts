import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalErrorComponent } from "@shared/components/modal-error-component/modal-error-component";
import { ModalConfirmComponent } from "@shared/components/modal-confirm-component/modal-confirm-component";
import { ToastSuccessComponent } from "@shared/components/toast-success-component/toast-success-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalErrorComponent, ModalConfirmComponent, ToastSuccessComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('biblioteca-wallmapu');
}
