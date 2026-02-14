import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthStore } from '@features/auth/services/auth-store';

@Component({
  selector: 'app-auth-button-component',
  imports: [RouterLink],
  templateUrl: './auth-button-component.html',
})
export class AuthButtonComponent {
  private auth = inject(AuthStore);

  // 🔹 Exponer las signals para el template
  user = this.auth.user;
  isAuthenticated = this.auth.isAuthenticated;
  loading = this.auth.loading;

  // 🔹 Métodos para el template
  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }
}
