import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NavigationModel } from '@shared/models/navigation-model';
import { RouterOutlet } from "@angular/router";
import { DashboardNavbarComponent } from '@layouts/components/dashboard-navbar-component/dashboard-navbar-component';
import { DashboardSidebarComponent } from "@layouts/components/dashboard-sidebar-component/dashboard-sidebar-component";
import { ArrowUpComponent } from "@layouts/components/arrow-up-component/arrow-up-component";


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-component',
  imports: [
    RouterOutlet,
    DashboardNavbarComponent,
    DashboardSidebarComponent,
    ArrowUpComponent
],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent {
  navigation = input.required<NavigationModel[]>();
}
