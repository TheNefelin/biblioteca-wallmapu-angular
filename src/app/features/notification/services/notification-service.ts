import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { NotificationModel } from '@features/notification/models/notification-model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'notifications';

  getAllPagination(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<NotificationModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<NotificationModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<NotificationModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<NotificationModel[]>>>(
      `${this.endpoint}/user/pagination${path}`
    );
  }
}
