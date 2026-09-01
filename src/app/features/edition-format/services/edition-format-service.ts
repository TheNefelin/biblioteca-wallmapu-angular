import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { EditionFormatModel } from '@features/edition-format/models/edition-format-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionFormatService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-format';

  delete(book_subject: EditionFormatModel): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      `${this.endpoint}/${book_subject.id_edition}`, book_subject.id_format
    );
  }

  delete_by_edition(id_edition: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      `${this.endpoint}/edition`, id_edition
    );
  }
}
