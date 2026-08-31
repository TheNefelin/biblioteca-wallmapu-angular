import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { CreateFormatModel, FormatModel, UpdateFormatModel } from '@features/format/models/format-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'format';

  getAllPagination(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<FormatModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiService.getAll<ApiResponseModel<PaginationResponseModel<FormatModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<ApiResponseModel<FormatModel[]>> {
    return this.ApiService.getAll<ApiResponseModel<FormatModel[]>>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateFormatModel): Observable<ApiResponseModel<FormatModel>> {
    return this.ApiService.create<ApiResponseModel<FormatModel>, CreateFormatModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateFormatModel): Observable<ApiResponseModel<FormatModel>> {
    return this.ApiService.update<ApiResponseModel<FormatModel>, UpdateFormatModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }  
}
