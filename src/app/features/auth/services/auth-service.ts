import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';
import { ApiAuthRequest } from '@features/auth/models/api-auth-request';
import { ApiAuthResponse } from '@features/auth/models/api-auth-response';
import { User } from '@features/auth/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);  // ✅ 5. Inyectar HttpClient
  
  // ✅ Estado reactivo con señales
  private currentUser = signal<User | null>(this.getStoredUser());
  private isLoading = signal(false);
  
  // ✅ Señales públicas
  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  loading = computed(() => this.isLoading());
  
  // Client ID de Google y API URL
  private clientId = environment.googleClientId;
  private apiUrl = environment.apiUrl; 

  // ✅ Obtener usuario del localStorage
  private getStoredUser(): User | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }
  
  // ✅ Inicializar Google Identity Services
  initializeGoogleAuth(): void {
    // Declarar google como any porque es un script externo
    const google = (window as any).google;
    
    if (!google?.accounts) {
      console.error('Google Identity Services script no cargado');
      return;
    }
    
    // Inicializar para One Tap (opcional)
    if (google.accounts.id) {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  }
  
    // Manejar respuesta de Google (One Tap - JWT)
    private async handleGoogleResponse(response: any): Promise<void> {
      this.isLoading.set(true);
      const googleToken = response.credential; // JWT de Google
      
      console.log('Token JWT recibido de Google');
      
      try {
        // ✅ 7. Enviar token a tu backend
        await this.authenticateWithBackend(googleToken);
      } catch (error) {
        console.error('Error en autenticación:', error);
        this.isLoading.set(false);
      }
    }
  
  // ✅ Trigger manual del login (para tu botón)
  triggerGoogleLogin(): void {
    const google = (window as any).google;
    
    if (!google?.accounts) {
      console.error('Google Identity Services no está disponible. Asegúrate de que el script se haya cargado.');
      this.isLoading.set(false);
      return;
    }
    
    if (!this.clientId) {
      console.error('Client ID no configurado. Asegúrate de llamar initializeGoogleAuth primero.');
      this.isLoading.set(false);
      return;
    }
    
    this.isLoading.set(true);
    
    // Usar OAuth 2.0 flow para login manual con botón
    // Este es el método recomendado para botones de login personalizados
    if (google.accounts.oauth2 && google.accounts.oauth2.initTokenClient) {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'email profile',
          callback: async (response: any) => { // ✅ 8. Hacer callback async
            if (response.access_token) {
              // Obtener información del usuario usando el access token
              // ✅ 9. Enviar token a tu backend
              await this.authenticateWithBackend(response.access_token);
            } else if (response.error) {
              console.error('Error en login de Google:', response.error);
              this.isLoading.set(false);
            }
          },
          error_callback: (error: any) => {
            console.log('Usuario canceló el login o cerró la ventana:', error);
            this.isLoading.set(false); 
          }
        });
        
        client.requestAccessToken();
      } catch (error) {
        console.error('Error al inicializar el cliente OAuth de Google:', error);
        this.isLoading.set(false);
      }
    } else {
      console.error('Google OAuth 2.0 no está disponible. Verifica que el script de Google Identity Services se haya cargado correctamente.');
      this.isLoading.set(false);
    }
  }
  
  // ✅ 10. NUEVO MÉTODO: Autenticar con tu backend
  private async authenticateWithBackend(googleToken: string): Promise<void> {
    try {
      // Crear el request body
      const requestBody: ApiAuthRequest = {
        googleToken: googleToken
      };
      
      // Llamar a tu API
      const response = await firstValueFrom(
        this.http.post<ApiAuthResponse>(`${this.apiUrl}/auth/google`, requestBody)
      );
      
      console.log('✅ Autenticación exitosa con backend');
      
      // ✅ 11. Guardar JWT de TU backend (no el de Google)
      localStorage.setItem('token', response.token);
      
      // ✅ 12. Crear objeto User con los datos del backend
      const user: User = {
        id_user: response.user.id_user,
        email: response.user.email,
        name: response.user.name || '',
        picture: response.user.picture || undefined,
        profileComplete: response.user.profileComplete,
        user_role_id: response.user.user_role_id
      };
      
      // Guardar usuario en estado y localStorage
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.isLoading.set(false);
      
      // ✅ 13. Redirigir según profileComplete
      if (!user.profileComplete) {
        console.log('⚠️ Perfil incompleto, redirigiendo a completar perfil...');
        this.router.navigate(['/user/profile']);  // Ajusta esta ruta según tu estructura
      } else {
        console.log('✅ Perfil completo, redirigiendo a home...');
        this.router.navigate(['/']);
      }
      
    } catch (error: any) {
      console.error('❌ Error al autenticar con backend:', error);
      
      // ✅ 14. Manejo de errores amigable
      if (error.status === 401) {
        alert('No se pudo verificar tu cuenta de Google. Intenta de nuevo.');
      } else if (error.status === 400) {
        alert('Email no verificado en Google.');
      } else {
        alert('Error en el servidor. Intenta de nuevo más tarde.');
      }
      
      this.isLoading.set(false);
      throw error;
    }
  }
  
  // ✅ 15. Actualizar logout para limpiar el token
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');  // ✅ Limpiar JWT del backend
    this.router.navigate(['/']);
  }
}
