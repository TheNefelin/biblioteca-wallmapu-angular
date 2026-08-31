import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';

@Injectable({
  providedIn: 'root',
})
export class LoanPoliciesService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'loan-policies';

  getDefault(): Observable<ApiResponseModel<LoanPoliciesModel>> {
    return this.ApiService.getAll<ApiResponseModel<LoanPoliciesModel>>(
      `${this.endpoint}/default`
    );
  }

  update(id: number, item: LoanPoliciesModel): Observable<ApiResponseModel<LoanPoliciesModel>> {
    return this.ApiService.update<ApiResponseModel<LoanPoliciesModel>, LoanPoliciesModel>(
      this.endpoint, id, item
    );
  }
}
