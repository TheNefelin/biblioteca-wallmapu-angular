import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'division-commune';

  getAll(): Observable<CommuneModel[]> {
    return this.apiService.getAll<CommuneModel[]>(this.endpoint);
  }
}