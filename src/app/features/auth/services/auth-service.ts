import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAuthGoogleRequest } from '../models/api-auth-google-request';
import { ApiAuthGoogleResponse } from '../models/api-auth-google-response';
import { ApiService } from '@core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'auth/google';

  auth(item: ApiAuthGoogleRequest): Observable<ApiAuthGoogleResponse> {
    return this.apiService.create<ApiAuthGoogleResponse, ApiAuthGoogleRequest>(
      this.endpoint, item
    );
  }
}
