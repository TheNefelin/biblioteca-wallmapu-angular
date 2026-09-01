import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { CopyStatusModel } from '@features/copy-status/models/copy-status-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CopyStatusService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'copy-status';
  private cache: { data: CopyStatusModel[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<CopyStatusModel[]> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<CopyStatusModel[]>(
      `${this.endpoint}/`
    ).pipe(
      tap(response => {
        this.cache = { data: response, timestamp: Date.now() };
      })
    );
  }
}
