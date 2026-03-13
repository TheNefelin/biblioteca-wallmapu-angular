import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { EditionFormModel } from '@features/edition/models/edition-form-model';

@Injectable({
  providedIn: 'root',
})
export class EditionService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition';

  getById(id: number): Observable<ApiResponseModel<EditionDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionDetailModel | null>>(
      this.endpoint, id
    );
  }

  create(item: EditionFormModel): Observable<ApiResponseModel<EditionFormModel>> {
    return this.apiResponseService.create<ApiResponseModel<EditionFormModel>, EditionFormModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: EditionFormModel): Observable<ApiResponseModel<EditionFormModel>> {
    return this.apiResponseService.update<ApiResponseModel<EditionFormModel>, EditionFormModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
