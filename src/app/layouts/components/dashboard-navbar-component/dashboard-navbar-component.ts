import { Component } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";

@Component({
  selector: 'app-dashboard-navbar-component',
  imports: [
    AuthButtonComponent
  ],
  templateUrl: './dashboard-navbar-component.html',
})
export class DashboardNavbarComponent {
  protected version = environment.version;
}
