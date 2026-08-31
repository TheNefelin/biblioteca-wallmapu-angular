import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { Observable, tap } from 'rxjs';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { ApiService } from '@core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'user-status';
  private cache: { data: ApiResponseModel<UserStatusModel[]>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ApiResponseModel<UserStatusModel[]>> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.apiService.getAll<ApiResponseModel<UserStatusModel[]>>(
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
