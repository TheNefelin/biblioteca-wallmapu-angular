import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'division-commune';

  getAll(): Observable<CommuneModel[]> {
    return this.ApiResponseService.getAll<CommuneModel[]>(
      `${this.endpoint}/`
    );
  }
}
