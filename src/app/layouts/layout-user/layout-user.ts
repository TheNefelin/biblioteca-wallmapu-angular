import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DashboardComponent } from '@layouts/components/dashboard-component/dashboard-component';
import { NAVIGATION_USER } from '@shared/constants/navigation-user';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout-user',
  imports: [
    DashboardComponent
  ],
  templateUrl: './layout-user.html',
})
export class LayoutUser {
  protected readonly navigation = NAVIGATION_USER;
}
