import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';

@Injectable({
  providedIn: 'root',
})
export class BookSubjectStepService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'book-subject';

  delete(book_subject: BookSubjectStepModel): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      `${this.endpoint}/${book_subject.id_book}`, book_subject.id_subject
    );
  }

  delete_by_book(id_book: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      `${this.endpoint}/book`, id_book
    );
  }  
}
