import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { UserRoleModel } from '@features/user-role/models/user-role-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'user-role';
  private cache: { data: ApiResponseModel<UserRoleModel[]>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ApiResponseModel<UserRoleModel[]>> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.apiResponseService.getAll<ApiResponseModel<UserRoleModel[]>>(
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
