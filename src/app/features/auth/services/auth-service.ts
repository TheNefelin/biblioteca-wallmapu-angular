import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAuthGoogleRequest } from '../models/api-auth-google-request';
import { ApiAuthGoogleResponse } from '../models/api-auth-google-response';
import { ApiResponseService } from '@core/services/api-response-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'auth/google';

  auth(item: ApiAuthGoogleRequest): Observable<ApiAuthGoogleResponse> {
    return this.ApiResponseService.create<ApiAuthGoogleResponse, ApiAuthGoogleRequest>(
      this.endpoint, item
    );
  }
}
