import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { BookDetailModel, BookModel, SaveBookModel } from '@features/book/models/book-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'books';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<BookDetailModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<BookDetailModel[]>>(
      this.endpoint, params
    );
  }

  getById(id: number): Observable<BookModel | null> {
    return this.apiService.getById<BookModel | null>(
      this.endpoint, id
    );
  }

  create(item: SaveBookModel): Observable<BookModel> {
    return this.apiService.create<BookModel, SaveBookModel>(
      this.endpoint, item
    );
  }  

  update(id: number, item: SaveBookModel): Observable<BookModel> {
    return this.apiService.update<BookModel, SaveBookModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }
}
