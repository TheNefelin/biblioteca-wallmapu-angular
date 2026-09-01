import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditionImageService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'edition-image';

  create(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiService.create<string, FormData>(
      this.endpoint, formData
    );
  }

  delete(id_edition: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id_edition
    );
  }
}
