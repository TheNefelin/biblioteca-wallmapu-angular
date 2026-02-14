import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '@features/auth/services/auth-google-service';
import { AuthService } from '@features/auth/services/auth-service';
import { User } from '@features/auth/models/user';
import { ApiAuthGoogleRequest } from '@features/auth/models/api-auth-google-request';
import { ApiAuthGoogleResponse } from '@features/auth/models/api-auth-google-response';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private router = inject(Router);
  private googleAuth = inject(AuthGoogleService);
  private apiAuth = inject(AuthService);
  
  // 🔹 Signals internas
  private currentUser = signal<User | null>(this.getStoredUser());
  private isLoading = signal(false);

  // 🔹 Signals públicas
  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  loading = computed(() => this.isLoading());

  private getStoredUser(): User | null {
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
      const response: ApiAuthGoogleResponse = await firstValueFrom(
        this.apiAuth.auth(request)
      ).then(res => res.result);

      // 3️⃣ Guardar JWT
      localStorage.setItem('token', response.token);

      // 4️⃣ Guardar usuario
      const user: User = response.user;
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));

      // 5️⃣ Redirigir según profileComplete
      if (!user.profileComplete) {
        this.router.navigate(['/user/profile']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      alert(error?.message || 'Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // 🔹 Logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
