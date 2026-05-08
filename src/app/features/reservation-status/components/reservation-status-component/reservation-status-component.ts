import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { ReservationStatusService } from '@features/reservation-status/services/reservation-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-status-component',
  imports: [LoadingComponent],
  templateUrl: './reservation-status-component.html',
})
export class ReservationStatusComponent {
  protected readonly isLoading = computed(() => this.getReservationStatusRX.isLoading());
  
  private readonly reservationStatusService = inject(ReservationStatusService);
  protected readonly computedReservationStatusList = computed<ReservationStatusModel[]>(() => this.getReservationStatusRX.value() ?? []);
  
  private readonly getReservationStatusRX = rxResource({
    stream: () => {    
      return this.reservationStatusService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });    
}
