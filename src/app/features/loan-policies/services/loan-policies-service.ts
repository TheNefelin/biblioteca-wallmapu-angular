import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';

@Injectable({
  providedIn: 'root',
})
export class LoanPoliciesService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loan-policies';

  getDefault(): Observable<LoanPoliciesModel> {
    return this.ApiResponseService.getAll<LoanPoliciesModel>(
      `${this.endpoint}/default`
    );
  }

  update(id: number, item: LoanPoliciesModel): Observable<LoanPoliciesModel> {
    return this.ApiResponseService.update<LoanPoliciesModel, LoanPoliciesModel>(
      this.endpoint, id, item
    );
  }
}
