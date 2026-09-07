import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { ReservationDetailModel, ReservationFilterModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { catchError, map, of } from 'rxjs';
import { ReservationListComponent } from "@features/reservation/components/reservation-list-component/reservation-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ReservationBarcodeComponent } from "@features/reservation/components/reservation-barcode-component/reservation-barcode-component";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-user-reservation-page',
  imports: [
    ReservationListComponent,
    SectionHeaderComponent,
    ReservationBarcodeComponent,
    LoanPolicyComponent,
  ],
  templateUrl: './user-reservation-page.html',
})
export class UserReservationPage extends CrudPage<ReservationDetailModel> {
  // STATE ------------------------------------------------------------------------
  protected readonly selectedReservation = signal<ReservationDetailModel | null>(null);
  protected readonly selectFilterStatusId = signal<number>(0);

  // SERVICES ----------------------------------------------------------------------
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);
  private readonly reservationService = inject(ReservationService);

  // RESERVATION STATE --------------------------------------------------------------
  protected readonly reservation = {
    dataList: computed<ReservationDetailModel[]>(() => this.getReservationRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getReservationRX.isLoading() && !this.getReservationRX.hasValue()),
    isSaving: signal<boolean>(false),
  }

  // FETCHS -------------------------------------------------------------------------
  private readonly getPaginationPayload = computed<PaginationRequestModel<ReservationFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        id_status: this.selectFilterStatusId(),
      }
    }
  });

  private readonly getReservationRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.reservationService.getByUserPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[ReservationService::UserReservationPage] getByUserPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS ---------------------------------------------------
  protected override reload(): void {
    this.getReservationRX.reload();
    this.selectedReservation.set(null);
  }

  // RESERVATION ACTIONS -------------------------------------------------------------
  protected onSelectedReservation(item: ReservationDetailModel): void {
    if (item.reservation_status_id === 1) {
      this.selectedReservation.set(item);
      return;
    }

    this.selectedReservation.set(null);
  }

  protected onFilterByIdStatus(status: ReservationStatusModel | null): void {
    this.selectFilterStatusId.set(status?.id_status ?? 0);
    this.currentPage.set(1);
  }

  protected async onCancelReservation(id_reservation: number): Promise<void> {
    if (!id_reservation) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Cancelar Reserva',
      message: 'Estás seguro que deseas cancelar la Reserva?',
    });
    if (!confirmed) return;

    this.mutation.run(
      this.reservationService.cancel(id_reservation),
      { isSaving: this.reservation.isSaving },
      {
        successMsg: 'Reserva eliminada correctamente',
        errorMsg: 'Error al cancelar la Reserva',
        onSuccess: () => this.reload(),
      }
    );
  }
}