import { DatePipe } from '@angular/common';
import { Component, input, output, signal, effect } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Component({
  selector: 'app-reservation-list-components',
  imports: [
    DatePipe,
    LoadingComponent,
    ReservationStatusSelectComponents,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './reservation-list-components.html',
})
export class ReservationListComponents {
  readonly isLoading = input<boolean>(false);
  readonly selectStatusId = input<number>(0);
  readonly paginationAndReservationList = input<PaginationResponseModel<ReservationDetailModel[]> | null>(null);
  protected readonly selectedReservation = output<ReservationDetailModel>();
  protected readonly selectedIdStatus = output<number>();
  protected readonly cancelReservation = output<number>();
  protected readonly reload = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly prevPage = output<void>();

  protected readonly totalPages = signal<number>(1);

  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationAndReservationList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });

  protected selectReservation(item: ReservationDetailModel): void {
    this.selectedReservation.emit(item);
  }
}
