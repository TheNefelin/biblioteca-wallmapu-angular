import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanStatusService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'loan-status';
  private cache: { data: LoanStatusModel[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<LoanStatusModel[]> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<LoanStatusModel[]>(
      `${this.endpoint}/`
    ).pipe(
      tap(response => {
        this.cache = { data: response, timestamp: Date.now() };
      })
    );
  }
}
