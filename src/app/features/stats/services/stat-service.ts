import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { AdminStatsModel, UserStatsModel } from '@features/stats/models/stat-model';

@Injectable({
  providedIn: 'root',
})
export class StatService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'stat';

  getAdminStats(): Observable<AdminStatsModel> {
    return this.ApiResponseService.getAll<AdminStatsModel>(
      `${this.endpoint}/admin-stats`
    );
  }

  getUserStats(): Observable<UserStatsModel> {
    return this.ApiResponseService.getAll<UserStatsModel>(
      `${this.endpoint}/user-stats`
    );
  }
}
