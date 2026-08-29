import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'division-commune';

  getAll(): Observable<ApiResponseModel<CommuneModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<CommuneModel[]>>(
      `${this.endpoint}/`
    );
  }
}
