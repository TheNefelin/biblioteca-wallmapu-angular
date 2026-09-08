import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { UserStatsComponent } from "@features/stats/components/user-stats-component/user-stats-component";
import { UserDetailModel } from '@features/user/models/user-model';
import { AuthUser } from '@features/auth/models/auth-user';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-user-profile-component',
  imports: [
    NgOptimizedImage,
    UserStatsComponent,
    ButtonComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-profile-component.html',
})
export class UserProfileComponent {
  readonly authUser = input<AuthUser | null>(null);
  readonly user = input<UserDetailModel | null>(null);
  protected readonly editProfile = output<void>();
}
