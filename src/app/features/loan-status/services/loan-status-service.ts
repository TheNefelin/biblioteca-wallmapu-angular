import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';

@Injectable({
  providedIn: 'root',
})
export class LoanStatusService {
  private readonly api = inject(ApiService);

  getAll(): Observable<LoanStatusModel[]> {
    return this.api.getAll<LoanStatusModel[]>('loan-status');
  }
}