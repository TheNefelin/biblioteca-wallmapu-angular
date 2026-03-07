import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookAuthorStepService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'book-author';

  delete(book_subject: BookAuthorStepModel): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/${book_subject.id_book}`, book_subject.id_author
    );
  }
}
