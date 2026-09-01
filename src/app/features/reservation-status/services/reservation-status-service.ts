import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationStatusService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'reservation-status';
  private cache: { data: ReservationStatusModel[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ReservationStatusModel[]> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<ReservationStatusModel[]>(
      `${this.endpoint}/`
    ).pipe(
      tap(response => {
        this.cache = { data: response, timestamp: Date.now() };
      })
    );
  }
}
