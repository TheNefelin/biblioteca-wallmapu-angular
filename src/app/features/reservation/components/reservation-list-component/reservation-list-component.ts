import { DatePipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponent } from "@features/reservation-status/components/reservation-status-select-component/reservation-status-select-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reservation-list-component',
  imports: [
    DatePipe,
    LoadingComponent,
    ReservationStatusSelectComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './reservation-list-component.html',
})
export class ReservationListComponent {
  readonly isLoading = input<boolean>(false);
  readonly selectStatusId = input<number | undefined>(undefined);
  readonly reservationList = input<ReservationDetailModel[]>([]);
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  protected readonly selectedReservation = output<ReservationDetailModel>();
  protected readonly selectedIdStatus = output<ReservationStatusModel | null>();
  protected readonly cancelReservation = output<number>();
  protected readonly reload = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly prevPage = output<void>();
}