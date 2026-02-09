import { Component } from '@angular/core';
import { NAVIGATION_ADMIN } from '@shared/constants/navigation-admin';
import { DashboardComponent } from "@shared/components/dashboard-component/dashboard-component";
import { ArrowUpComponent } from "@shared/components/arrow-up-component/arrow-up-component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    DashboardComponent,
    ArrowUpComponent
],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  protected readonly navigationItems = NAVIGATION_ADMIN;
}
