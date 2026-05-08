import { inject, Injectable, signal } from '@angular/core';
import { NotificationService } from './notification-service';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationBadgeState {
  private notificationService = inject(NotificationService);
  
  readonly unreadCount = signal<number>(0);
  private isLoaded = false;

  loadUnreadCount(): void {
    if (this.isLoaded) return;
    
    this.notificationService.getUnreadCount()
      .pipe(
        catchError(() => of({ isSuccess: true, data: 0 }))
      )
      .subscribe(response => {
        if (response.isSuccess) {
          this.unreadCount.set(response.data);
          this.isLoaded = true;
        }
      });
  }

  decrementCount(): void {
    this.unreadCount.update(c => Math.max(0, c - 1));
  }

  refresh(): void {
    this.notificationService.getUnreadCount()
      .pipe(
        catchError(() => of({ isSuccess: true, data: 0 }))
      )
      .subscribe(response => {
        if (response.isSuccess) {
          this.unreadCount.set(response.data);
        }
      });
  }
}
