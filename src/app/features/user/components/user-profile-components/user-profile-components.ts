import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { UserStatsComponents } from "@features/stats/components/user-stats-components/user-stats-components";
import { UserDetailModel } from '@features/user/models/user-model';
import { AuthUser } from '@features/auth/models/auth-user';
import { Role } from '@shared/constants/roles-enum';
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";

@Component({
  selector: 'app-user-profile-components',
  imports: [
    CommonModule,
    NgOptimizedImage,
    UserStatsComponents,
    ButtonEditComponent
],
  templateUrl: './user-profile-components.html',
})
export class UserProfileComponents {
  private router = inject(Router);
  
  readonly authUser = input<AuthUser | null>(null);
  readonly userDetailModel = input<UserDetailModel | null>(null);

  protected onEdit(): void {
    const id_user = this.userDetailModel()?.id_user
    const isAdmin = this.authUser()?.role == Role.Admin;

    if (id_user) {
      const formRoute = isAdmin
      ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.FORM(id_user)
      : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.FORM(id_user);

      this.router.navigate([formRoute]);
    }
  }
}
