import { inject, Injectable } from '@angular/core';
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

  getAllPagination(params: PaginationRequestModel): Observable<PaginationResponseModel<BookDetailModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.ApiResponseService.getAll<PaginationResponseModel<BookDetailModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getById(id: number): Observable<BookModel | null> {
    return this.ApiResponseService.getById<BookModel | null>(
      this.endpoint, id
    );
  }

  create(item: CreateBookModel): Observable<BookModel> {
    return this.ApiResponseService.create<BookModel, CreateBookModel>(
      this.endpoint, item
    );
  }  

  update(id: number, item: UpdateBookModel): Observable<BookModel> {
    return this.ApiResponseService.update<BookModel, UpdateBookModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      this.endpoint, id
    );
  }
}
