import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { CreateReservationModel, ReservationDetailModel, ReservationFilterModel, ReservationModel, ReservationPickupModel } from '@features/reservation/models/reservation-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'reservations';

  getAllPagination(params: PaginationRequestModel<ReservationFilterModel>): Observable<PaginationResponseModel<ReservationDetailModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<ReservationDetailModel[]>, ReservationFilterModel>(
      this.endpoint, params
    );
  }

  getByUserPagination(params: PaginationRequestModel<ReservationFilterModel>): Observable<PaginationResponseModel<ReservationDetailModel[]>> {
    return this.apiService.getAllPaginationByPath<PaginationResponseModel<ReservationDetailModel[]>, ReservationFilterModel>(
      `${this.endpoint}/pagination/user`, params
    );
  }

  getById(id: number): Observable<ReservationDetailModel | null> {
    return this.apiService.getById<ReservationDetailModel | null>(
      this.endpoint, id
    );
  }

  create(item: CreateReservationModel): Observable<ReservationModel> {
    return this.apiService.create<ReservationModel, CreateReservationModel>(
      this.endpoint, item
    );
  }

  pickup(params: ReservationPickupModel): Observable<ReservationModel> {
    return this.apiService.update<ReservationModel, { copy_id: number }>(
      this.endpoint, `${params.id_reservation}/pickup`, { copy_id: params.copy_id }
    );
  }

  cancel(id: number): Observable<ReservationModel> {
    return this.apiService.update<ReservationModel, null>(
      this.endpoint, `${id}/cancel`, null
    );
  }

  expire(): Observable<number> {
    return this.apiService.update<number, null>(
      this.endpoint, `expire-overdue`, null
    );
  }
}