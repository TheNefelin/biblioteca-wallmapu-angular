import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { LoanFilterModel, LoanDetailModel, LoanModel } from '@features/loan/models/loan-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'loans';

  getAllPagination(params: PaginationRequestModel<LoanFilterModel>): Observable<PaginationResponseModel<LoanDetailModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<LoanDetailModel[]>, LoanFilterModel>(
      this.endpoint, params
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<LoanFilterModel>): Observable<PaginationResponseModel<LoanDetailModel[]>> {
    return this.apiService.getAllPaginationByPath<PaginationResponseModel<LoanDetailModel[]>, LoanFilterModel>(
      `${this.endpoint}/pagination/user`, params
    );
  }

  getAllOverdue(): Observable<LoanDetailModel[]> {
    return this.apiService.getAll<LoanDetailModel[]>(
      `${this.endpoint}/overdue`
    );
  }

  getByCopyBarCode(codebar: string): Observable<LoanDetailModel | null> {
    return this.apiService.getById<LoanDetailModel | null>(
      `${this.endpoint}/copy`, codebar
    );
  }

  return(id_copy: number): Observable<LoanModel> {
    return this.apiService.update<LoanModel, null>(
      `${this.endpoint}/copy`, `${id_copy}/return`, null
    );
  }

  expire(): Observable<number> {
    return this.apiService.update<number, null>(
      this.endpoint, `expire-overdue`, null
    );
  }
}