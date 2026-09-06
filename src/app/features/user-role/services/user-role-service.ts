import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { UserRoleModel } from '@features/user-role/models/user-role-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'user-role';

  getAll(): Observable<UserRoleModel[]> {
    return this.apiService.getAll<UserRoleModel[]>(this.endpoint);
  }
}