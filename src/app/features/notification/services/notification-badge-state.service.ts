import { inject, Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '@environments/environment';
import { NotificationService } from './notification-service';
import { LoggerService } from '@core/services/logger-service';

@Injectable({ providedIn: 'root' })
export class NotificationBadgeState {
  private notificationService = inject(NotificationService);
  private logger = inject(LoggerService);
  private apiUrl = environment.apiUrl;

  readonly unreadCount = signal<number>(0);

  private websocket: WebSocket | null = null;
  private shouldReconnect = true;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;

  connect(): void {
    if (!this.getToken()) return;

    this.shouldReconnect = true;
    this.loadUnreadCount();
    this.setupWebSocket();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.clearTimers();
    this.closeWebSocket();
  }

  refresh(): void {
    this.loadUnreadCount();
  }

  private setupWebSocket(): void {
    if (this.websocket) return;

    const wsUrl = this.apiUrl.replace(/^http/, 'ws') + '/notifications/ws?token=' + this.getToken();
    this.websocket = new WebSocket(wsUrl);

    this.websocket.onopen = () => {
      this.stopPolling();
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'unread_count') {
          this.unreadCount.set(data.unread_count);
        }
      } catch (e) {
        this.logger.error('NotificationBadgeState', 'Error parsing WebSocket message', e);
      }
    };

    this.websocket.onclose = () => {
      this.websocket = null;
      if (this.shouldReconnect && this.getToken()) {
        this.startPolling();
        this.scheduleReconnect();
      }
    };

    this.websocket.onerror = () => {
      // onclose will fire after onerror
    };
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      if (this.shouldReconnect && this.getToken()) {
        this.setupWebSocket();
      }
    }, 3000);
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

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private clearTimers(): void {
    this.stopPolling();
    this.clearReconnectTimer();
  }

  private closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.onclose = null;
      this.websocket.close();
      this.websocket = null;
    }
  }

  private getToken(): string {
    return localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token') || '';
  }

  async loadUnreadCount(): Promise<void> {
    if (!this.getToken()) {
      this.disconnect();
      return;
    }

    try {
      const count = await firstValueFrom(
        this.notificationService.getUnreadCount()
          .pipe(catchError(() => of(0)))
      );
      this.unreadCount.set(count);
    } catch {
      // handled by catchError above
    }
  }
}