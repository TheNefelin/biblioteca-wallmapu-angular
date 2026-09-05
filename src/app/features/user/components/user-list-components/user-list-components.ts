import { Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { Role } from '@shared/constants/roles-enum';
import { UserDetailModel } from '@features/user/models/user-model';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-user-list-components',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    ButtonComponent
  ],
  templateUrl: './user-list-components.html',
})
export class UserListComponents {
  readonly editRole = input.required<Role>();
  readonly isLoading = input<boolean>(true);
  readonly userDetailModelList = input<UserDetailModel[]>([]);
  readonly onEditUser = output<UserDetailModel>();

  protected onEdit(user: UserDetailModel): void {
    this.onEditUser.emit(user);
  }
}
