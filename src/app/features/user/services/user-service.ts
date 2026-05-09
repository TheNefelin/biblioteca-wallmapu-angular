import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserByAdminModel, UpdateUserModel, UserDetailModel, UserModel } from '@features/user/models/user-model';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'users';

  getAllDetails(params: PaginationRequestModel): Observable<ApiResponseModel<PaginationResponseModel<UserDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<UserDetailModel[]>>>(
      `${this.endpoint}/detailed${path}`
    );
  }

  getById(id: string): Observable<ApiResponseModel<UserDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<UserDetailModel | null>>(
      `${this.endpoint}/detailed`, id
    );
  }

  update_user(id_user: string, item: UpdateUserModel): Observable<ApiResponseModel<UserModel>> {
    return this.apiResponseService.update<ApiResponseModel<UserModel>, UpdateUserModel>(
      this.endpoint, id_user, item
    );
  }

  update_admin(id_user: string, item: UpdateUserByAdminModel): Observable<ApiResponseModel<UserModel>> {
    return this.apiResponseService.update<ApiResponseModel<UserModel>, UpdateUserByAdminModel>(
      `${this.endpoint}/admin`, id_user, item
    );
  }
}
