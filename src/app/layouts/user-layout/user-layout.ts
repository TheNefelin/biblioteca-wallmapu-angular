import { Component } from '@angular/core';
import { DashboardComponent } from "@shared/components/dashboard-component/dashboard-component";
import { NAVIGATION_USER } from '@shared/constants/navigation-user';

@Component({
  selector: 'app-user-layout',
  imports: [
    DashboardComponent,
],
  templateUrl: './user-layout.html',
})
export class UserLayout {
  protected readonly navigationItems = NAVIGATION_USER;
}
