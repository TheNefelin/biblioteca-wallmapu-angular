import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@features/auth/services/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth-button-component',
  imports: [RouterLink],
  templateUrl: './auth-button-component.html',
})
export class AuthButtonComponent implements OnInit {
  private auth = inject(AuthService);
  
  // ✅ Exponer las señales del servicio para el template
  user = this.auth.user;
  isAuthenticated = this.auth.isAuthenticated;
  loading = this.auth.loading;
  
  ngOnInit(): void {
    // ✅ Esperar a que el script de Google se cargue antes de inicializar
    this.waitForGoogleScript().then(() => {
      this.auth.initializeGoogleAuth();
    });
  }
  
  // ✅ Esperar a que el script de Google Identity Services esté disponible
  private waitForGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      const google = (window as any).google;
      // Verificar que tanto accounts.id como accounts.oauth2 estén disponibles
      if (google?.accounts?.id && google?.accounts?.oauth2) {
        resolve();
        return;
      }
      
      // Intentar cada 100ms hasta que Google esté disponible (máximo 10 segundos)
      let attempts = 0;
      const maxAttempts = 100;
      const interval = setInterval(() => {
        attempts++;
        const google = (window as any).google;
        if (google?.accounts?.id && google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error('Google Identity Services no se cargó completamente después de 10 segundos');
          console.warn('Verifica que el script https://accounts.google.com/gsi/client esté cargado en index.html');
          resolve(); // Resolver de todas formas para no bloquear
        }
      }, 100);
    });
  }
  
  // ✅ Método para el botón de login
  login(): void {
    this.auth.triggerGoogleLogin();
  }
  
  // ✅ Método para logout
  logout(): void {
    this.auth.logout();
  }
}
