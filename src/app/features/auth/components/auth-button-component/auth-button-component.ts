import { Component, computed, effect, inject } from '@angular/core';
import { AuthStore } from '@features/auth/services/auth-store';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant'
import { RouterLink } from "@angular/router";
import { Role } from '@shared/constants/roles-enum';
import { NotificationBadgeState } from '@features/notification/services/notification-badge-state.service';
import { NotificationBellComponents } from "@features/notification/components/notification-bell-components/notification-bell-components";

@Component({
  selector: 'app-auth-button-component',
  imports: [
    RouterLink,
    NotificationBellComponents
],
  templateUrl: './auth-button-component.html',
})
export class AuthButtonComponent {
  private readonly badgeState = inject(NotificationBadgeState);
  readonly unreadCount = this.badgeState.unreadCount;

  private readonly connectNotification = effect(() => {
    if (this.isAuthenticated()) {
      this.badgeState.connect();
    }
  });
  
  private auth = inject(AuthStore);

  // 🔹 Exponer las signals para el template
  user = this.auth.user;
  isAuthenticated = this.auth.isAuthenticated;
  loading = this.auth.loading;

  navigateTo = computed<string>(() => {
    switch(this.user()?.role) { 
      case Role.Admin:
        return ROUTES_CONSTANTS.PROTECTED.ADMIN.DASHBOARD
      case Role.Reader:
        return ROUTES_CONSTANTS.PROTECTED.USER.DASHBOARD 
      default:
        return ROUTES_CONSTANTS.HOME.ROOT;
    }
  });

  protected navigateToProfile = computed<string>(() => {
    switch(this.user()?.role) { 
      case Role.Admin:
        return ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.ROOT
      case Role.Reader:
        return ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.ROOT
      default:
        return ROUTES_CONSTANTS.HOME.ROOT;
    }
  });

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}
