import { effect, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  // ✅ Señal interna opcional para saber si el script está listo
  private scriptReady = signal(false);

  constructor() {
    this.checkGoogleScript();
  }

  // 🔹 Espera a que window.google esté disponible
  private checkGoogleScript(): void {
    const google = (window as any).google;

    if (google?.accounts?.oauth2) {
      this.scriptReady.set(true);
      return;
    }

    // Poll cada 100ms hasta 10 segundos
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const google = (window as any).google;
      if (google?.accounts?.oauth2) {
        clearInterval(interval);
        this.scriptReady.set(true);
      } else if (attempts >= 100) {
        clearInterval(interval);
        console.error(
          'Google Identity Services no se cargó después de 10 segundos. Revisa que el script esté en index.html'
        );
      }
    }, 100);
  }

   // 🔹 Método público para obtener access_token via popup
   async getAccessToken(): Promise<string> {
    // ✅ Esperar hasta que el script esté listo
    await this.waitForScript();

    return new Promise((resolve, reject) => {
      const google = (window as any).google;
      if (!google?.accounts?.oauth2?.initTokenClient) {
        reject('Google OAuth2 no disponible');
        return;
      }

      const client = google.accounts.oauth2.initTokenClient({
        client_id: environment.googleClientId,
        scope: 'email profile',
        callback: (response: any) => {
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(response.error || 'No se recibió access_token');
          }
        },
        error_callback: (error: any) => {
          reject(error);
        },
      });

      // ✅ Abrir popup
      client.requestAccessToken();
    });
  }

 // 🔹 Espera interna hasta que scriptReady sea true
  private waitForScript(): Promise<void> {
    return new Promise((resolve) => {
      if (this.scriptReady()) {
        resolve();
        return;
      }

      // Reaccionar a cambios usando effect en lugar de subscribe
      const effectRef = effect(() => {
        if (this.scriptReady()) {
          effectRef.destroy(); // ✅ detener el efecto
          resolve();
        }
      });
    });
  }
  
}
