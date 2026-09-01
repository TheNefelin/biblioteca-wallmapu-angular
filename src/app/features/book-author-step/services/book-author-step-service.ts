import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookAuthorStepService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'book-author';

  delete(book_subject: BookAuthorStepModel): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      `${this.endpoint}/${book_subject.id_book}`, book_subject.id_author
    );
  }

  delete_by_book(id_book: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      `${this.endpoint}/book`, id_book
    );
  }
}
