import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '@features/auth/services/auth-google-service';
import { AuthService } from '@features/auth/services/auth-service';
import { AuthUser } from '@features/auth/models/auth-user';
import { ApiAuthGoogleRequest } from '@features/auth/models/api-auth-google-request';
import { ApiAuthGoogleResponse } from '@features/auth/models/api-auth-google-response';
import { firstValueFrom } from 'rxjs';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { ModalErrorService } from '@core/services/modal-error-service';
import { Role } from '@shared/constants/roles-enum';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private router = inject(Router);
  private googleAuth = inject(AuthGoogleService);
  private apiAuth = inject(AuthService);
  private errorModal = inject(ModalErrorService);
  
  // 🔹 Signals internas
  private currentUser = signal<AuthUser | null>(this.getStoredUser());
  private isLoading = signal(false);

  // 🔹 Signals públicas
  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  loading = computed(() => this.isLoading());

  private getStoredUser(): AuthUser | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }

   // 🔹 Login principal
  async login(): Promise<void> {
    try {
      this.isLoading.set(true);

      // 1️⃣ Obtener access_token de Google
      const googleToken = await this.googleAuth.getAccessToken();

      // 2️⃣ Enviar token al backend
      const request: ApiAuthGoogleRequest = { googleToken };
      const response: ApiAuthGoogleResponse = await firstValueFrom(this.apiAuth.auth(request));

      // 3️⃣ Guardar JWT
      localStorage.setItem('jwt_token', response.token);

      // 4️⃣ Guardar usuario
      const user: AuthUser = response.user;
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));

      // 5️⃣ Redirigir según profileComplete
      let navigateTo = '';

      switch(user.role) {
        case Role.Reader:
          navigateTo = user.profileComplete ? ROUTES_CONSTANTS.PROTECTED.USER.DASHBOARD : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.ROOT;
          break;
        case Role.Admin:
          navigateTo = user.profileComplete ? ROUTES_CONSTANTS.PROTECTED.ADMIN.DASHBOARD : ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.ROOT;
          break;
        default:
          navigateTo = ROUTES_CONSTANTS.HOME.ROOT
      }

      this.router.navigate([navigateTo]);
    } catch (error: any) {
      this.errorModal.openError(error?.status || 0, error?.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // 🔹 Logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    this.router.navigate([ROUTES_CONSTANTS.HOME.ROOT]);
  }
}
