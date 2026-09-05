import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-reservation-list-component',
  imports: [
    DatePipe,
    LoadingComponent,
    ReservationStatusSelectComponents,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './reservation-list-component.html',
})
export class ReservationListComponent {
  readonly isLoading = input<boolean>(false);
  readonly selectStatusId = input<number>(0);
  readonly reservationList = input<ReservationDetailModel[]>([]);
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  protected readonly selectedReservation = output<ReservationDetailModel>();
  protected readonly selectedIdStatus = output<number>();
  protected readonly cancelReservation = output<number>();
  protected readonly reload = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly prevPage = output<void>();
}