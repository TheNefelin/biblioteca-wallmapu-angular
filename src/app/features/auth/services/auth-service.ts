import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiAuthGoogleRequest } from '../models/api-auth-google-request';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiAuthGoogleResponse } from '../models/api-auth-google-response';
import { ApiService } from '@core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'auth/google';

  auth(item: ApiAuthGoogleRequest): Observable<ApiResponseModel<ApiAuthGoogleResponse>> {
    return this.ApiService.create<ApiResponseModel<ApiAuthGoogleResponse>, ApiAuthGoogleRequest>(
      this.endpoint, item
    );
  }
}
