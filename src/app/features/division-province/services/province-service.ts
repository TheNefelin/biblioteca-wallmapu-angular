import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { ProvinceModel } from '@features/division-province/models/province-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'division-province';

  getAll(): Observable<ProvinceModel[]> {
    return this.apiService.getAll<ProvinceModel[]>(this.endpoint);
  }
}