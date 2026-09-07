import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationModel } from '@shared/models/navigation-model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-sidebar-component',
  imports: [
    RouterLink,
  ],
  templateUrl: './dashboard-sidebar-component.html',
})
export class DashboardSidebarComponent {
  navigation = input.required<NavigationModel[]>();
}
