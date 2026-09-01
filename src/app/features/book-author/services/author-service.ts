import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { AuthorModel, CreateAuthorModel, UpdateAuthorModel } from '@features/book-author/models/author-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'author';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<AuthorModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiResponseService.getAll<PaginationResponseModel<AuthorModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<AuthorModel[]> {
    return this.ApiResponseService.getAll<AuthorModel[]>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateAuthorModel): Observable<AuthorModel> {
    return this.ApiResponseService.create<AuthorModel, CreateAuthorModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateAuthorModel): Observable<AuthorModel> {
    return this.ApiResponseService.update<AuthorModel, UpdateAuthorModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      this.endpoint, id
    );
  }
}
