import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserByAdminModel, UpdateUserModel, UserDetailModel, UserModel } from '@features/user/models/user-model';
import { ApiService } from '@core/services/api-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'users';

  getAllDetails(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<UserDetailModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<UserDetailModel[]>>(
      this.endpoint, params
    );
  }

  getById(id: string): Observable<UserDetailModel | null> {
    return this.apiService.getById<UserDetailModel | null>(
      this.endpoint, id
    );
  }

  update_user(id_user: string, item: UpdateUserModel): Observable<UserModel> {
    return this.apiService.update<UserModel, UpdateUserModel>(
      this.endpoint, id_user, item
    );
  }

  update_admin(id_user: string, item: UpdateUserByAdminModel): Observable<UserModel> {
    return this.apiService.update<UserModel, UpdateUserByAdminModel>(
      `${this.endpoint}/admin`, id_user, item
    );
  }
}