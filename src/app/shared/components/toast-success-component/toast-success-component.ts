import { Component, inject } from '@angular/core';
import { ToastSuccessService } from '@core/services/toast-success-service';

@Component({
  selector: 'app-toast-success-component',
  imports: [],
  templateUrl: './toast-success-component.html',
})
export class ToastSuccessComponent {
  private service = inject(ToastSuccessService);

  toasts = this.service.toasts;

  protected close(id: number): void {
    this.service.clear(id);
  }
}
