import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { CreateEditorialModel, EditorialModel, UpdateEditorialModel } from '@features/book-editorial/models/editorial-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'editorial';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<EditorialModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiResponseService.getAll<PaginationResponseModel<EditorialModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<EditorialModel[]> {
    return this.ApiResponseService.getAll<EditorialModel[]>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateEditorialModel): Observable<EditorialModel> {
    return this.ApiResponseService.create<EditorialModel, CreateEditorialModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateEditorialModel): Observable<EditorialModel> {
    return this.ApiResponseService.update<EditorialModel, UpdateEditorialModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
