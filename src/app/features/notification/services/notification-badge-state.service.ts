import { inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '@environments/environment';
import { NotificationService } from './notification-service';

@Injectable({ providedIn: 'root' })
export class NotificationBadgeState {
  private notificationService = inject(NotificationService);
  private apiUrl = environment.apiUrl;

  readonly unreadCount = signal<number>(0);
  private websocket: WebSocket | null = null;
  private shouldReconnect = true;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;

  connect(): void {
    const token = this.getToken();
    if (!token || this.websocket) return;

    this.loadUnreadCount();
    this.setupWebSocket(token);
    this.startPolling();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.stopPolling();
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  private setupWebSocket(token: string): void {
    const wsUrl = this.apiUrl.replace(/^http/, 'ws') + '/notifications/ws?token=' + token;

    this.websocket = new WebSocket(wsUrl);

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'unread_count') {
          this.unreadCount.set(data.unread_count);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    this.websocket.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => {
          if (!this.getToken()) {
            this.disconnect();
          } else {
            this.setupWebSocket(this.getToken());
          }
        }, 3000);
      }
    };

    this.websocket.onerror = () => {
      // onclose will fire after onerror, reconnection handled there
    };
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollingTimer = setInterval(() => this.loadUnreadCount(), 30000);
  }

  private stopPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  private getToken(): string {
    return localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token') || '';
  }

  loadUnreadCount(): void {
    if (!this.getToken()) {
      this.disconnect();
      return;
    }

    this.notificationService.getUnreadCount()
      .pipe(catchError(() => of({ isSuccess: true, data: 0 } as any)))
      .subscribe(response => {
        if (response.isSuccess) {
          this.unreadCount.set(response.data);
        }
      });
  }

  refresh(): void {
    this.loadUnreadCount();
  }
}
