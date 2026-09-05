import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationStatusService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'reservation-status';

  getAll(): Observable<ReservationStatusModel[]> {
    return this.apiService.getAll<ReservationStatusModel[]>(
      this.endpoint
    );
  }
}