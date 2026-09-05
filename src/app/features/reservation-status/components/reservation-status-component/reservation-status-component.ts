import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { ReservationStatusService } from '@features/reservation-status/services/reservation-status-service';
import { catchError, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-status-component',
  standalone: true,
  imports: [LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservation-status-component.html',
})
export class ReservationStatusComponent {
  protected readonly isLoading = computed(() => this.reservationStatusRX.isLoading());

  private readonly reservationStatusService = inject(ReservationStatusService);
  protected readonly computedReservationStatusList = computed<ReservationStatusModel[]>(() => this.reservationStatusRX.value() ?? []);

  private readonly reservationStatusRX = rxResource({
    stream: () => {
      return this.reservationStatusService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });
}