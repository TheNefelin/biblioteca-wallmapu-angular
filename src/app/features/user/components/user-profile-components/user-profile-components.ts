import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailModel } from '@features/user/models/user-detail-model';
import { Role } from '@shared/constants/roles-enum';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { UserStatsComponents } from "@features/stats/components/user-stats-components/user-stats-components";

@Component({
  selector: 'app-user-profile-components',
  imports: [
    CommonModule,
    NgOptimizedImage,
    UserStatsComponents
],
  templateUrl: './user-profile-components.html',
})
export class UserProfileComponents {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS
  private router = inject(Router);

  readonly editRole = input.required<Role>();
  readonly picture = input.required<string>()
  readonly userDetailModel = input<UserDetailModel | null>(null);

  protected onEdit(userDetailModel: UserDetailModel | null): void {
    if (userDetailModel) {
      const isAdmin = this.editRole() === Role.Admin;

      const formRoute = isAdmin
      ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.FORM
      : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.FORM;

      const backRoute = isAdmin
      ? ROUTES_CONSTANTS.PROTECTED.ADMIN.PROFILE.ROOT
      : ROUTES_CONSTANTS.PROTECTED.USER.PROFILE.ROOT;

      this.router.navigate([formRoute], {
        state: {
          editRole: this.editRole(),
          picture: this.picture(),
          userDetailModel: userDetailModel,
          navigateBack: backRoute,
        },
      });
    }
  }
}
