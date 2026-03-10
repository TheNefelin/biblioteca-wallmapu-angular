import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { EditionModel } from '@features/edition/models/edition-model';

@Injectable({
  providedIn: 'root',
})
export class EditionService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition';

  getById(id: number): Observable<ApiResponseModel<EditionModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionModel | null>>(
      this.endpoint, id
    );
  }
}
