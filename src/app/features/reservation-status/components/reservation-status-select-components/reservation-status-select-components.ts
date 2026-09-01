import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { ReservationStatusService } from '@features/reservation-status/services/reservation-status-service';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-reservation-status-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './reservation-status-select-components.html',
})
export class ReservationStatusSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  protected readonly isLoading = computed(() => this.getReservationStatusRX.isLoading());
  
  private readonly reservationStatusService = inject(ReservationStatusService);
  protected readonly computedReservationStatusList = computed<ReservationStatusModel[]>(() => [
    { id_status: 0, name: 'Todos los Estados' },
    ...this.getReservationStatusRX.value() ?? []
  ]);
  
  private readonly getReservationStatusRX = rxResource({
    stream: () => {    
      return this.reservationStatusService.getAll().pipe(
        map(response => response),
        catchError(err => {
          return of(null);
        })
      );
    },
  });    
  
  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value);
    this.newSelectedId.emit(newId); 
  }
}
