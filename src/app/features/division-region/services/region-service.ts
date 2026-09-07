import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { RegionModel } from '@features/division-region/models/region-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'division-region';

  getAll(): Observable<RegionModel[]> {
    return this.apiService.getAll<RegionModel[]>(this.endpoint);
  }
}