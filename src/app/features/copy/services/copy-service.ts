import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CopyDetailModel, CopyModel, CreateCopyModel, UpdateCopyModel } from '@features/copy/models/copy-model';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'copy';

  getAllByEditionId(id_edition: number): Observable<CopyDetailModel[]> {
    return this.ApiResponseService.getById<CopyDetailModel[]>(
      `${this.endpoint}/detail/edition`, id_edition
    );
  }

  getAllByBookId(id_book: number): Observable<CopyDetailModel[]> {
    return this.ApiResponseService.getById<CopyDetailModel[]>(
      `${this.endpoint}/detail/book`, id_book
    );
  }  

  create(item: CreateCopyModel): Observable<CopyModel> {
    return this.ApiResponseService.create<CopyModel, CreateCopyModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateCopyModel): Observable<CopyModel> {
    return this.ApiResponseService.update<CopyModel, UpdateCopyModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      this.endpoint, id
    );
  }
}
