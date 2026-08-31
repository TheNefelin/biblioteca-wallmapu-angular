import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommuneService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'division-commune';

  getAll(): Observable<ApiResponseModel<CommuneModel[]>> {
    return this.ApiService.getAll<ApiResponseModel<CommuneModel[]>>(
      `${this.endpoint}/`
    );
  }
}
