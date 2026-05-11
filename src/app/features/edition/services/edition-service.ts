import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { CreateEditionModel, EditionModel, UpdateEditionModel } from '../models/edition-model';
import { EditionFilterModel } from '@features/edition/models/edition-filter-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class EditionService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition';

  getAllPagination(params: PaginationRequestModel<EditionFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<EditionDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_author && params.filter.id_author > 0)
        path = `${path}&id_author=${params.filter.id_author}`
      
      if (params.filter.id_editorial && params.filter.id_editorial > 0)
        path = `${path}&id_editorial=${params.filter.id_editorial}`
      
      if (params.filter.id_genre && params.filter.id_genre > 0)
        path = `${path}&id_genre=${params.filter.id_genre}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<EditionDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllByBook(id_book: number): Observable<ApiResponseModel<EditionModel[]>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionModel[]>>(
      `${this.endpoint}/book`, id_book
    );
  }

  getByIdDetail(id: number): Observable<ApiResponseModel<EditionDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionDetailModel | null>>(
      this.endpoint, `${id}/detail`
    );
  }

  getById(id: number): Observable<ApiResponseModel<EditionModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionModel | null>>(
      this.endpoint, id
    );
  }

  create(item: CreateEditionModel): Observable<ApiResponseModel<EditionModel>> {
    return this.apiResponseService.create<ApiResponseModel<EditionModel>, CreateEditionModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateEditionModel): Observable<ApiResponseModel<EditionModel>> {
    return this.apiResponseService.update<ApiResponseModel<EditionModel>, UpdateEditionModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }
}
