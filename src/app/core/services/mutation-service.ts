import { Injectable, inject, type WritableSignal } from '@angular/core';
import { finalize, type Observable } from 'rxjs';
import { ToastSuccessService } from '@core/services/toast-success-service';

export interface MutationOptions {
  successMsg: string;
  errorMsg: string;
  onSuccess?: () => void;
  onClose?: () => void;
  onFinalize?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class MutationService {
  private readonly successService = inject(ToastSuccessService);

  run<T>(
    action: Observable<T>,
    state: { isSaving: WritableSignal<boolean> },
    options: MutationOptions,
  ): void {
    let succeeded = false;
    state.isSaving.set(true);
    action.pipe(
      finalize(() => {
        state.isSaving.set(false);
        if (succeeded) options.onClose?.();
        options.onFinalize?.();
      })
    ).subscribe({
      next: () => {
        succeeded = true;
        this.successService.show(options.successMsg);
        options.onSuccess?.();
      },
      error: (err) => {
        console.error(`[${options.errorMsg}]:`, err);
      }
    });
  }
}
