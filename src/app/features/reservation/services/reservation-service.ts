import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { CreateReservationModel, ReservationDetailModel, ReservationFilterModel, ReservationModel, ReservationPickupModel } from '@features/reservation/models/reservation-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'reservations';

  getAllPagination(params: PaginationRequestModel<ReservationFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<ReservationDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<ReservationDetailModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }

  getByUserPagination(params: PaginationRequestModel<ReservationFilterModel>): Observable<ApiResponseModel<PaginationResponseModel<ReservationDetailModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    if (params.filter) {
      if (params.filter.id_status && params.filter.id_status > 0)
        path = `${path}&id_status=${params.filter.id_status}`
    }

    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<ReservationDetailModel[]>>>(
      `${this.endpoint}/pagination/user${path}`
    );
  }  
  
  getById(id: number): Observable<ApiResponseModel<ReservationDetailModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<ReservationDetailModel | null>>(
      this.endpoint, id
    );
  }  

  create(item: CreateReservationModel): Observable<ApiResponseModel<ReservationModel>> {
    return this.apiResponseService.create<ApiResponseModel<ReservationModel>, CreateReservationModel>(
      this.endpoint, item
    );
  }
  
  pickup(params: ReservationPickupModel): Observable<ApiResponseModel<ReservationModel>> {
    return this.apiResponseService.update<ApiResponseModel<ReservationModel>, { copy_id: number }>(
      this.endpoint, `${params.id_reservation}/pickup`, { copy_id: params.copy_id }
    );
  }

  cancel(id: number): Observable<ApiResponseModel<ReservationModel>> {
    return this.apiResponseService.update<ApiResponseModel<ReservationModel>, null>(
      this.endpoint, `${id}/cancel`, null
    );
  }

  expire(): Observable<ApiResponseModel<number>> {
    return this.apiResponseService.update<ApiResponseModel<number>, null>(
      this.endpoint, `expire-overdue`, null
    );
  } 
}
