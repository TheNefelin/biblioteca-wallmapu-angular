import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { CreateNotificationByEmailModel, NotificationDetailModel, NotificationFilterModel, NotificationModel } from '@features/notification/models/notification-model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'notifications';

  getAllPagination(params: PaginationRequestModel<NotificationFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<NotificationDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
    
    if (params.filter?.is_read !== undefined)
      path = `${path}&is_read=${params.filter.is_read}`
   
    return this.ApiService.getAll<ApiResponseModel<PaginationResponseModel<NotificationDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<NotificationFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<NotificationDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
    
    if (params.filter?.is_read !== undefined)
      path = `${path}&is_read=${params.filter.is_read}`
   
    return this.ApiService.getAll<ApiResponseModel<PaginationResponseModel<NotificationDetailModel[]>>>(
      `${this.endpoint}/user/pagination${path}`
    );
  }

  create(item: CreateNotificationByEmailModel): Observable<ApiResponseModel<NotificationModel>> {
    return this.ApiService.create<ApiResponseModel<NotificationModel>, CreateNotificationByEmailModel>(
      this.endpoint, item
    );
  }

  markAsReadByUser(id: number): Observable<ApiResponseModel<NotificationModel>> {
    return this.ApiService.update<ApiResponseModel<NotificationModel>, null>(
      `${this.endpoint}/user`, `${id}/read`, null
    );
  } 

  markAllAsReadByUser(): Observable<ApiResponseModel<NotificationModel>> {
    return this.ApiService.update<ApiResponseModel<NotificationModel>, null>(
      `${this.endpoint}/user`, `read-all`, null
    );
  } 

  getUnreadCount(): Observable<ApiResponseModel<number>> {
    return this.ApiService.getAll<ApiResponseModel<number>>(
      `${this.endpoint}/user/unread-count`
    );
  }
}
