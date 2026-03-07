import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';

@Injectable({
  providedIn: 'root',
})
export class BookSubjectStepService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'book-subject';

  delete(book_subject: BookSubjectStepModel): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/${book_subject.id_book}`, book_subject.id_subject
    );
  }
}
