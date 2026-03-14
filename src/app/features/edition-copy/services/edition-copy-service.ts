import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';
import { Observable } from 'rxjs';
import { EditionCopyFormModel } from '@features/edition-copy/models/edition-copy-form-model';

@Injectable({
  providedIn: 'root',
})
export class EditionCopyService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-copy';

  getById(id: number): Observable<ApiResponseModel<EditionCopyDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionCopyDetailModel | null>>(
      this.endpoint, id
    );
  }
  
  create(item: EditionCopyFormModel): Observable<ApiResponseModel<EditionCopyDetailModel>> {
    return this.apiResponseService.create<ApiResponseModel<EditionCopyDetailModel>, EditionCopyFormModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: EditionCopyFormModel): Observable<ApiResponseModel<EditionCopyDetailModel>> {
    return this.apiResponseService.update<ApiResponseModel<EditionCopyDetailModel>, EditionCopyFormModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
