import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionImageService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-image';

  create(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.ApiResponseService.create<string, FormData>(
      `${this.endpoint}`, formData
    );
  }

  delete(id_edition: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      this.endpoint, id_edition
    );
  }
}
