import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { UserStatsComponents } from "@features/stats/components/user-stats-components/user-stats-components";
import { UserDetailModel } from '@features/user/models/user-model';
import { AuthUser } from '@features/auth/models/auth-user';
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";

@Component({
  selector: 'app-user-profile-components',
  imports: [
    NgOptimizedImage,
    UserStatsComponents,
    ButtonEditComponent
],
  templateUrl: './user-profile-components.html',
})
export class UserProfileComponents {
  readonly authUser = input<AuthUser | null>(null);
  readonly userDetailModel = input<UserDetailModel | null>(null);
  readonly onEditProfile = output<void>();

  protected onEdit(): void {
    this.onEditProfile.emit();
  }
}
