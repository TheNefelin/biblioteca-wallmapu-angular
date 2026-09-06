import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { CreateNotificationByEmailModel, NotificationDetailModel, NotificationFilterModel, NotificationModel } from '@features/notification/models/notification-model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'notifications';

  getAllPagination(params: PaginationRequestModel<NotificationFilterModel>): Observable<PaginationResponseModel<NotificationDetailModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<NotificationDetailModel[]>, NotificationFilterModel>(
      this.endpoint, params
    );
  }

  getAllPaginationByUser(params: PaginationRequestModel<NotificationFilterModel>): Observable<PaginationResponseModel<NotificationDetailModel[]>> {
    return this.apiService.getAllPaginationByPath<PaginationResponseModel<NotificationDetailModel[]>, NotificationFilterModel>(
      `${this.endpoint}/user/pagination`, params
    );
  }

  create(item: CreateNotificationByEmailModel): Observable<NotificationModel> {
    return this.apiService.create<NotificationModel, CreateNotificationByEmailModel>(
      this.endpoint, item
    );
  }

  markAsReadByUser(id: number): Observable<NotificationModel> {
    return this.apiService.update<NotificationModel, null>(
      `${this.endpoint}/user`, `${id}/read`, null
    );
  }

  markAllAsReadByUser(): Observable<NotificationModel> {
    return this.apiService.update<NotificationModel, null>(
      `${this.endpoint}/user`, `read-all`, null
    );
  }

  getUnreadCount(): Observable<number> {
    return this.apiService.getAll<number>(
      `${this.endpoint}/user/unread-count`
    );
  }
}
