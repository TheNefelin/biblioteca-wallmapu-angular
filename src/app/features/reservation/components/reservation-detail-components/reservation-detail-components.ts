import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';

@Component({
  selector: 'app-reservation-detail-components',
  imports: [
    DatePipe,
  ],
  templateUrl: './reservation-detail-components.html',
})
export class ReservationDetailComponents {
  readonly reservationModel = input<ReservationDetailModel | null>(null)
}
