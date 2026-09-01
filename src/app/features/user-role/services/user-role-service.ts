import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { UserRoleModel } from '@features/user-role/models/user-role-model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'user-role';
  private cache: { data: UserRoleModel[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<UserRoleModel[]> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.ApiResponseService.getAll<UserRoleModel[]>(
      `${this.endpoint}/`
    ).pipe(
      tap(response => {
        this.cache = { data: response, timestamp: Date.now() };
      })
    );
  }
}
