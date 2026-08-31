import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { AuthorModel, CreateAuthorModel, UpdateAuthorModel } from '@features/book-author/models/author-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'author';

  getAllPagination(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<AuthorModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiService.getAll<ApiResponseModel<PaginationResponseModel<AuthorModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<ApiResponseModel<AuthorModel[]>> {
    return this.ApiService.getAll<ApiResponseModel<AuthorModel[]>>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateAuthorModel): Observable<ApiResponseModel<AuthorModel>> {
    return this.ApiService.create<ApiResponseModel<AuthorModel>, CreateAuthorModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateAuthorModel): Observable<ApiResponseModel<AuthorModel>> {
    return this.ApiService.update<ApiResponseModel<AuthorModel>, UpdateAuthorModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
