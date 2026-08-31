import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { CreateEditorialModel, EditorialModel, UpdateEditorialModel } from '@features/book-editorial/models/editorial-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'editorial';

  getAllPagination(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<EditorialModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiService.getAll<ApiResponseModel<PaginationResponseModel<EditorialModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<ApiResponseModel<EditorialModel[]>> {
    return this.ApiService.getAll<ApiResponseModel<EditorialModel[]>>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateEditorialModel): Observable<ApiResponseModel<EditorialModel>> {
    return this.ApiService.create<ApiResponseModel<EditorialModel>, CreateEditorialModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateEditorialModel): Observable<ApiResponseModel<EditorialModel>> {
    return this.ApiService.update<ApiResponseModel<EditorialModel>, UpdateEditorialModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }  
}
