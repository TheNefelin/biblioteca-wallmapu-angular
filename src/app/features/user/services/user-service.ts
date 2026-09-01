import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserByAdminModel, UpdateUserModel, UserDetailModel, UserModel } from '@features/user/models/user-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'users';

  getAllDetails(params: PaginationRequestModel): Observable<PaginationResponseModel<UserDetailModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.ApiResponseService.getAll<PaginationResponseModel<UserDetailModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getById(id: string): Observable<UserDetailModel | null> {
    return this.ApiResponseService.getById<UserDetailModel | null>(
      `${this.endpoint}`, id
    );
  }

  update_user(id_user: string, item: UpdateUserModel): Observable<UserModel> {
    return this.ApiResponseService.update<UserModel, UpdateUserModel>(
      this.endpoint, id_user, item
    );
  }

  update_admin(id_user: string, item: UpdateUserByAdminModel): Observable<UserModel> {
    return this.ApiResponseService.update<UserModel, UpdateUserByAdminModel>(
      `${this.endpoint}/admin`, id_user, item
    );
  }
}
