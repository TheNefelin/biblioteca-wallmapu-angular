import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { Role } from '@shared/constants/roles-enum';
import { UserDetailModel } from '@features/user/models/user-model';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";

@Component({
  selector: 'app-user-list-component',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    ButtonComponent,
    PaginationComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list-component.html',
})
export class UserListComponent {
  readonly editRole = input.required<Role>();
  readonly isLoading = input<boolean>(true);
  readonly userDetailModelList = input<UserDetailModel[]>([]);
  readonly totalPages = input<number>(0);
  readonly currentPage = input<number>(0);  
  protected readonly prevPage = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly editUser = output<UserDetailModel>();
}
