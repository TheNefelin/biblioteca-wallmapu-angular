import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { AdminStatsModel, UserStatsModel } from '@features/stats/models/stat-model';

@Injectable({
  providedIn: 'root',
})
export class StatService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'stat';

  getAdminStats(): Observable<ApiResponseModel<AdminStatsModel>> {
    return this.ApiService.getAll<ApiResponseModel<AdminStatsModel>>(
      `${this.endpoint}/admin-stats`
    );
  }

  getUserStats(): Observable<ApiResponseModel<UserStatsModel>> {
    return this.ApiService.getAll<ApiResponseModel<UserStatsModel>>(
      `${this.endpoint}/user-stats`
    );
  }
}
