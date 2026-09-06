import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'user-status';

  getAll(): Observable<UserStatusModel[]> {
    return this.apiService.getAll<UserStatusModel[]>(this.endpoint);
  }
}