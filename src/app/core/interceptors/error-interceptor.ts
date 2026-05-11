import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorModalService } from '@core/services/error-modal-service';
import { AuthStore } from '@features/auth/services/auth-store';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ErrorModalService);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const statusCode = error.status;
      const message = error.error?.message || error.message || 'Error inesperado';

      if (!modalService.isOpen()) {
        if (statusCode === 401) {
          modalService.openError(401, 'Tu sesión ha expirado.', () => authStore.logout());
        } else {
          modalService.openError(statusCode, message);
        }
      }

      return throwError(() => error);
    })
  );
};
