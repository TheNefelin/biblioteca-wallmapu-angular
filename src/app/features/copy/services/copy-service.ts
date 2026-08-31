import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CopyDetailModel, CopyModel, CreateCopyModel, UpdateCopyModel } from '@features/copy/models/copy-model';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'copy';

  getAllByEditionId(id_edition: number): Observable<ApiResponseModel<CopyDetailModel[]>> {
    return this.ApiResponseService.getById<ApiResponseModel<CopyDetailModel[]>>(
      `${this.endpoint}/detail/edition`, id_edition
    );
  }

  getAllByBookId(id_book: number): Observable<ApiResponseModel<CopyDetailModel[]>> {
    return this.ApiResponseService.getById<ApiResponseModel<CopyDetailModel[]>>(
      `${this.endpoint}/detail/book`, id_book
    );
  }  

  create(item: CreateCopyModel): Observable<ApiResponseModel<CopyModel>> {
    return this.ApiResponseService.create<ApiResponseModel<CopyModel>, CreateCopyModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateCopyModel): Observable<ApiResponseModel<CopyModel>> {
    return this.ApiResponseService.update<ApiResponseModel<CopyModel>, UpdateCopyModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
