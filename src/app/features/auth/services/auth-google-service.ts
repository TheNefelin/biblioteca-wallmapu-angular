import { Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';

interface AuthTokenResponse {
  access_token?: string;
  error?: string;
}

interface TokenClient {
  requestAccessToken(): void;
}

interface OAuth2Client {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: AuthTokenResponse) => void;
    error_callback: (error: unknown) => void;
  }): TokenClient;
}

interface GoogleAccounts {
  oauth2?: OAuth2Client;
}

const getGoogle = (): { accounts?: GoogleAccounts } | undefined =>
  (window as unknown as { google?: { accounts?: GoogleAccounts } }).google;

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  // ✅ Señal interna opcional para saber si el script está listo
  private scriptReady = signal(false);

  private readonly initGoogleCheck = this.checkGoogleScript();

  // 🔹 Espera a que window.google esté disponible
  private checkGoogleScript(): void {
    const google = getGoogle();

    if (google?.accounts?.oauth2) {
      this.scriptReady.set(true);
      return;
    }

    // Poll cada 100ms hasta 10 segundos
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const google = getGoogle();
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
      const oauth2 = getGoogle()?.accounts?.oauth2;
      if (!oauth2?.initTokenClient) {
        reject('Google OAuth2 no disponible');
        return;
      }

      const client = oauth2.initTokenClient({
        client_id: environment.googleClientId,
        scope: 'email profile',
        callback: (response) => {
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(response.error || 'No se recibió access_token');
          }
        },
        error_callback: (error) => {
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
      const check = () => {
        if (this.scriptReady()) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
  
}