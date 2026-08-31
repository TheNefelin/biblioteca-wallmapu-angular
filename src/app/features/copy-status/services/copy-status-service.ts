import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { CopyStatusModel } from '@features/copy-status/models/copy-status-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CopyStatusService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'copy-status';
  private cache: { data: ApiResponseModel<CopyStatusModel[]>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ApiResponseModel<CopyStatusModel[]>> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiService.getAll<ApiResponseModel<CopyStatusModel[]>>(
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
