import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { CreateSubjectModel, SubjectModel, UpdateSubjectModel } from '@features/book-subject/models/subject-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'subject';

  getAllPagination(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<SubjectModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiResponseService.getAll<ApiResponseModel<PaginationResponseModel<SubjectModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<ApiResponseModel<SubjectModel[]>> {
    return this.ApiResponseService.getAll<ApiResponseModel<SubjectModel[]>>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateSubjectModel): Observable<ApiResponseModel<SubjectModel>> {
    return this.ApiResponseService.create<ApiResponseModel<SubjectModel>, CreateSubjectModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateSubjectModel): Observable<ApiResponseModel<SubjectModel>> {
    return this.ApiResponseService.update<ApiResponseModel<SubjectModel>, UpdateSubjectModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }  
}
