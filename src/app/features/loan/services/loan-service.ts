import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { LoanFilterModel, LoanDetailModel, LoanModel } from '@features/loan/models/loan-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loans';

  getAllPagination(params: PaginationRequestModel<LoanFilterModel>): Observable<PaginationResponseModel<LoanDetailModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.ApiResponseService.getAll<PaginationResponseModel<LoanDetailModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<LoanFilterModel>): Observable<PaginationResponseModel<LoanDetailModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.ApiResponseService.getAll<PaginationResponseModel<LoanDetailModel[]>>(
      `${this.endpoint}/pagination/user${path}`
    );
  }  

  getAllOverdue(): Observable<LoanDetailModel[]> {
    return this.ApiResponseService.getAll<LoanDetailModel[]>(
      `${this.endpoint}/overdue`
    );
  }  

  getByCopyBarCode(codebar: string): Observable<LoanDetailModel | null> {
    return this.ApiResponseService.getById<LoanDetailModel | null>(
      `${this.endpoint}/copy`, codebar
    );
  }  

  return(id_copy: number): Observable<LoanModel> {
    return this.ApiResponseService.update<LoanModel, null>(
      `${this.endpoint}/copy`, `${id_copy}/return`, null
    );
  } 

  expire(): Observable<number> {
    return this.ApiResponseService.update<number, null>(
      this.endpoint, `expire-overdue`, null
    );
  } 
}