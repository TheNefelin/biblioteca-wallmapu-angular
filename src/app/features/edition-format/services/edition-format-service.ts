import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { EditionFormatModel } from '@features/edition-format/models/edition-format-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionFormatService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-format';

  delete(book_subject: EditionFormatModel): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/${book_subject.id_edition}`, book_subject.id_format
    );
  }

  delete_by_edition(id_edition: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      `${this.endpoint}/edition`, id_edition
    );
  }
}
