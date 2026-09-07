import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { AdminStatsModel, UserStatsModel } from '@features/stats/models/stat-model';

@Injectable({
  providedIn: 'root',
})
export class StatService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'stat';

  getAdminStats(): Observable<AdminStatsModel> {
    return this.apiService.getAll<AdminStatsModel>(
      `${this.endpoint}/admin-stats`
    );
  }

  getUserStats(): Observable<UserStatsModel> {
    return this.apiService.getAll<UserStatsModel>(
      `${this.endpoint}/user-stats`
    );
  }
}