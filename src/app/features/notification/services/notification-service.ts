import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CreateNotificationByEmailModel, NotificationDetailModel, NotificationFilterModel, NotificationModel } from '@features/notification/models/notification-model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'notifications';

  getAllPagination(params: PaginationRequestModel<NotificationFilterModel>): Observable<PaginationResponseModel<NotificationDetailModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
    
    if (params.filter?.is_read !== undefined)
      path = `${path}&is_read=${params.filter.is_read}`
   
    return this.ApiResponseService.getAll<PaginationResponseModel<NotificationDetailModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<NotificationFilterModel>): Observable<PaginationResponseModel<NotificationDetailModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
    
    if (params.filter?.is_read !== undefined)
      path = `${path}&is_read=${params.filter.is_read}`
   
    return this.ApiResponseService.getAll<PaginationResponseModel<NotificationDetailModel[]>>(
      `${this.endpoint}/user/pagination${path}`
    );
  }

  create(item: CreateNotificationByEmailModel): Observable<NotificationModel> {
    return this.ApiResponseService.create<NotificationModel, CreateNotificationByEmailModel>(
      this.endpoint, item
    );
  }

  markAsReadByUser(id: number): Observable<NotificationModel> {
    return this.ApiResponseService.update<NotificationModel, null>(
      `${this.endpoint}/user`, `${id}/read`, null
    );
  } 

  markAllAsReadByUser(): Observable<NotificationModel> {
    return this.ApiResponseService.update<NotificationModel, null>(
      `${this.endpoint}/user`, `read-all`, null
    );
  } 

  getUnreadCount(): Observable<number> {
    return this.ApiResponseService.getAll<number>(
      `${this.endpoint}/user/unread-count`
    );
  }
}
