import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SaveUserByAdminModel, SaveUserModel, UserModel } from '@features/user/models/user-model';
import { ApiService } from '@core/services/api-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'users';

  getAllDetails(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<UserModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<UserModel[]>>(
      this.endpoint, params
    );
  }

  getById(id: string): Observable<UserModel | null> {
    return this.apiService.getById<UserModel | null>(
      this.endpoint, id
    );
  }

  update_user(id_user: string, item: SaveUserModel): Observable<UserModel> {
    return this.apiService.update<UserModel, SaveUserModel>(
      this.endpoint, id_user, item
    );
  }

  update_admin(id_user: string, item: SaveUserByAdminModel): Observable<UserModel> {
    return this.apiService.update<UserModel, SaveUserByAdminModel>(
      `${this.endpoint}/admin`, id_user, item
    );
  }
}