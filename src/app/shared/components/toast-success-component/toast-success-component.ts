import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastSuccessService } from '@core/services/toast-success-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
