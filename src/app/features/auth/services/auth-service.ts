import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  
  // ✅ Estado reactivo con señales
  private currentUser = signal<User | null>(this.getStoredUser());
  private isLoading = signal(false);
  
  // ✅ Señales públicas
  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());
  loading = computed(() => this.isLoading());
  
  // ✅ Client ID de Google
  private clientId: string = '';
  
  // ✅ Obtener usuario del localStorage
  private getStoredUser(): User | null {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }
  
  // ✅ Inicializar Google Identity Services
  initializeGoogleAuth(clientId: string): void {
    // Declarar google como any porque es un script externo
    const google = (window as any).google;
    
    if (!google?.accounts) {
      console.error('Google Identity Services script no cargado');
      return;
    }
    
    // Guardar el clientId para usarlo en el login manual
    this.clientId = clientId;
    
    // Inicializar para One Tap (opcional)
    if (google.accounts.id) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  }
  
  // ✅ Manejar respuesta de Google (One Tap - JWT)
  private handleGoogleResponse(response: any): void {
    this.isLoading.set(true);
    const googleToken = response.credential; // JWT de Google
    
    console.log('Token JWT recibido de Google:', googleToken.substring(0, 50) + '...');
    
    // Decodificar el JWT para obtener información del usuario
    try {
      const payload = JSON.parse(atob(googleToken.split('.')[1]));
      
      const user: User = {
        id: payload.sub || 'google_' + Date.now(),
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
      
      // Guardar en estado y localStorage
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('google_jwt_token', googleToken);
      this.isLoading.set(false);
      
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al decodificar el token JWT de Google:', error);
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
          callback: (response: any) => {
            if (response.access_token) {
              // Obtener información del usuario usando el access token
              this.getUserInfo(response.access_token);
            } else if (response.error) {
              console.error('Error en login de Google:', response.error);
              this.isLoading.set(false);
            }
          },
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
  
  // ✅ Obtener información del usuario usando el access token
  private getUserInfo(accessToken: string): void {
    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => response.json())
    .then((data: any) => {
      const user: User = {
        id: data.id || 'google_' + Date.now(),
        email: data.email,
        name: data.name,
        picture: data.picture
      };
      
      // Guardar en estado y localStorage
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('google_access_token', accessToken);
      this.isLoading.set(false);
      
      this.router.navigate(['/']);
    })
    .catch((error) => {
      console.error('Error al obtener información del usuario:', error);
      this.isLoading.set(false);
    });
  }
  
  // ✅ Logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
