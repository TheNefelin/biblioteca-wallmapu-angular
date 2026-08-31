import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionImageService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'edition-image';

  create(file: File): Observable<ApiResponseModel<string>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.ApiService.create<ApiResponseModel<string>, FormData>(
      `${this.endpoint}`, formData
    );
  }

  delete(id_edition: number): Observable<ApiResponseModel<boolean>> {
    return this.ApiService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id_edition
    );
  }
}
