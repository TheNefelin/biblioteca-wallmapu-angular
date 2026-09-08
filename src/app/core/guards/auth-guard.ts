import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@features/auth/services/auth-store';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

export const authGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // 1️⃣ Verificar autenticación
  if (!authStore.isAuthenticated()) {
    return router.createUrlTree([ROUTES_CONSTANTS.HOME.ROOT]);
  }

  // 2️⃣ Obtener roles requeridos
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // 3️⃣ Si no hay roles definidos, permitir
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // 4️⃣ Obtener rol actual del usuario
  const user = authStore.user();

  const hasAccess = requiredRoles.includes(user?.role ?? '');

  if (hasAccess) {
    return true;
  }

  return router.createUrlTree([ROUTES_CONSTANTS.FORBIDDEN]);
};
