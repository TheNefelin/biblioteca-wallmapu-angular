import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';

@Component({
  selector: 'app-reservation-detail-component',
  imports: [
    DatePipe,
  ],
  templateUrl: './reservation-detail-component.html',
})
export class ReservationDetailComponent {
  readonly reservationModel = input<ReservationDetailModel | null>(null);
}
