import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';

@Injectable({
  providedIn: 'root',
})
export class LoanPoliciesService {
  private readonly api = inject(ApiService);

  getDefault(): Observable<LoanPoliciesModel> {
    return this.api.getAll<LoanPoliciesModel>('loan-policies/default');
  }

  update(id: number, item: LoanPoliciesModel): Observable<LoanPoliciesModel> {
    return this.api.update<LoanPoliciesModel, LoanPoliciesModel>('loan-policies', id, item);
  }
}