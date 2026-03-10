import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionImageService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-image';

  create(file: File): Observable<ApiResponseModel<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.apiResponseService.create<ApiResponseModel<string>, FormData>(
      `${this.endpoint}`, formData
    );
  }

  delete(id_edition: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id_edition
    );
  }
}
