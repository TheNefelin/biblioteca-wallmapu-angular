import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { BookFormModel } from '@features/book/models/book-form-model';
import { BookModel } from '@features/book/models/book-model';
import { PaginationModel } from '@core/models/pagination-model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'books';

  getAll(currentPage: number, maxItems:number, search: string = ""): Observable<ApiResponseModel<PaginationModel<BookDetailModel[]>>> {
    return this.apiResponseService.getAll<ApiResponseModel<PaginationModel<BookDetailModel[]>>>(
      `${this.endpoint}/?page=${currentPage}&limit=${maxItems}&search=${search}`
    );
  }

  getById(id: number): Observable<ApiResponseModel<BookDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<BookDetailModel | null>>(
      this.endpoint, id
    );
  }

  create(item: BookFormModel): Observable<ApiResponseModel<BookModel>> {
    return this.apiResponseService.create<ApiResponseModel<BookModel>, BookFormModel>(
      this.endpoint, item
    );
  }  

  update(id: number, item: BookFormModel): Observable<ApiResponseModel<BookModel>> {
    return this.apiResponseService.update<ApiResponseModel<BookModel>, BookFormModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
