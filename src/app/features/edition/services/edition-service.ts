import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CreateEditionModel, EditionDetailModel, EditionFilterModel, EditionModel, UpdateEditionModel } from '@features/edition/models/edition-model';
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

      if (params.filter.id_format && params.filter.id_format > 0)
        path = `${path}&id_format=${params.filter.id_format}`

      if (params.filter.id_subject && params.filter.id_subject > 0)
        path = `${path}&id_subject=${params.filter.id_subject}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<EditionDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllDetailByBook(id_book: number): Observable<ApiResponseModel<EditionDetailModel[]>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionDetailModel[]>>(
      `${this.endpoint}/book`, `${id_book}/detail`
    );
  }

  getAllByBook(id_book: number): Observable<ApiResponseModel<EditionModel[]>> {
    return this.apiResponseService.getById<ApiResponseModel<EditionModel[]>>(
      `${this.endpoint}/book`, id_book
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
