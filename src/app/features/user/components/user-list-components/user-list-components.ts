import { Component, inject, input } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { Role } from '@shared/constants/roles-enum';
import { UserDetailModel } from '@features/user/models/user-model';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";

@Component({
  selector: 'app-user-list-components',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    ButtonEditComponent
  ],
  templateUrl: './user-list-components.html',
})
export class UserListComponents {
  readonly editRole = input.required<Role>();
  readonly isLoading = input<boolean>(true);
  readonly userDetailModelList = input<UserDetailModel[]>([]);

  private router = inject(Router);

  protected onEdit(user: UserDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.FORM(user.id_user)])
  }
}
