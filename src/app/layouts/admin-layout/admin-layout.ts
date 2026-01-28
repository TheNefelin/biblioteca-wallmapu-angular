import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from "@angular/router";
import { ADMIN_NAVIGATION } from '@shared/constants/admin-navigation';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  protected readonly navigationItems = ADMIN_NAVIGATION;
}
