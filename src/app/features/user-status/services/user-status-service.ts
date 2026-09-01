import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { ApiResponseService } from '@core/services/api-response-service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'user-status';
  private cache: { data: UserStatusModel[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<UserStatusModel[]> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<UserStatusModel[]>(
      `${this.endpoint}/`
    ).pipe(
      tap(response => {
        this.cache = { data: response, timestamp: Date.now() };
      })
    );
  }
}
