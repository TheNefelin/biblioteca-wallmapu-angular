import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanStatusService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loan-status';
  private cache: { data: ApiResponseModel<LoanStatusModel[]>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ApiResponseModel<LoanStatusModel[]>> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<ApiResponseModel<LoanStatusModel[]>>(
      `${this.endpoint}/`
    ).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.cache = { data: response, timestamp: Date.now() };
        }
      })
    );
  }
}
