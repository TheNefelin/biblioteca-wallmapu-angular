import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookAuthorStepService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'book-author';

  delete(book_subject: BookAuthorStepModel): Observable<ApiResponseModel<boolean>> {
    return this.apiService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/${book_subject.id_book}`, book_subject.id_author
    );
  }

  delete_by_book(id_book: number): Observable<ApiResponseModel<boolean>> {
    return this.apiService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/book`, id_book
    );
  }
}
