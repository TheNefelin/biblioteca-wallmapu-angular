import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookDetailModel, BookModel, CreateBookModel, UpdateBookModel } from '@features/book/models/book-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'books';

  getAllPagination(params: PaginationRequestModel): Observable<ApiResponseModel<PaginationResponseModel<BookDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.ApiResponseService.getAll<ApiResponseModel<PaginationResponseModel<BookDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getById(id: number): Observable<ApiResponseModel<BookModel | null>> {
    return this.ApiResponseService.getById<ApiResponseModel<BookModel | null>>(
      this.endpoint, id
    );
  }

  create(item: CreateBookModel): Observable<ApiResponseModel<BookModel>> {
    return this.ApiResponseService.create<ApiResponseModel<BookModel>, CreateBookModel>(
      this.endpoint, item
    );
  }  

  update(id: number, item: UpdateBookModel): Observable<ApiResponseModel<BookModel>> {
    return this.ApiResponseService.update<ApiResponseModel<BookModel>, UpdateBookModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
