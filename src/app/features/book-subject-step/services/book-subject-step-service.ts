import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';

@Injectable({
  providedIn: 'root',
})
export class BookSubjectStepService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'book-subject';

  delete(book_subject: BookSubjectStepModel): Observable<ApiResponseModel<boolean>> {
    return this.ApiService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/${book_subject.id_book}`, book_subject.id_subject
    );
  }

  delete_by_book(id_book: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/book`, id_book
    );
  }  
}
