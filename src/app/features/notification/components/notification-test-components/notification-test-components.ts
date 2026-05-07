import { Component, effect, inject } from '@angular/core';
import { NotificationBadgeState } from '@features/notification/services/notification-badge-state.service';

@Component({
  selector: 'app-notification-test-components',
  imports: [],
  templateUrl: './notification-test-components.html',
})
export class NotificationTestComponents {
  private readonly badgeState = inject(NotificationBadgeState);
  private websocket: WebSocket | null = null;

  readonly unreadCount = this.badgeState.unreadCount;
  readonly isLoading = false;

  private readonly initEffect = effect((onCleanup) => {
    this.badgeState.loadUnreadCount();
    this.setupWebSocket();

    onCleanup(() => {
      if (this.websocket) {
        this.websocket.close();
      }
    });
  });

  private setupWebSocket(): void {
    const token = this.getToken();
    if (!token) {
      console.error('No JWT token found for WebSocket');
      return;
    }

    this.websocket = new WebSocket(`ws://localhost:8000/api/notifications/ws?token=${token}`);

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'unread_count') {
          this.badgeState.unreadCount.set(data.unread_count);
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    this.websocket.onclose = () => {
      // Reconectar si se pierde conexión
      setTimeout(() => this.setupWebSocket(), 3000);
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private getToken(): string {
    return localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token') || '';
  }

  reload(): void {
    this.badgeState.refresh();
  }
}
