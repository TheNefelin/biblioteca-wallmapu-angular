import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { RegionModel } from '@features/division-region/models/region-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'division-region';
  private cache: { data: ApiResponseModel<RegionModel[]>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ApiResponseModel<RegionModel[]>> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<ApiResponseModel<RegionModel[]>>(
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
