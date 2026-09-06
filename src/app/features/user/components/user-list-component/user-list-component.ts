import { Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { Role } from '@shared/constants/roles-enum';
import { UserDetailModel } from '@features/user/models/user-model';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-user-list-component',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    ButtonComponent
  ],
  templateUrl: './user-list-component.html',
})
export class UserListComponent {
  readonly editRole = input.required<Role>();
  readonly isLoading = input<boolean>(true);
  readonly userDetailModelList = input<UserDetailModel[]>([]);
  protected readonly editUser = output<UserDetailModel>();
}
