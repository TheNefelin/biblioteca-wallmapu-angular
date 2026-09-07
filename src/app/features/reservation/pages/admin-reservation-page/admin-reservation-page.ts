import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { ReservationDetailModel, ReservationFilterModel, ReservationPickupModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { catchError, map, of } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ReservationListComponent } from "@features/reservation/components/reservation-list-component/reservation-list-component";
import { ReservationToLoanComponent } from "@features/reservation/components/reservation-to-loan-component/reservation-to-loan-component";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-reservation-page',
  imports: [
    SectionHeaderComponent,
    ReservationListComponent,
    ReservationToLoanComponent,
    LoanPolicyComponent,
    ButtonComponent,
  ],
  templateUrl: './admin-reservation-page.html',
})
export class AdminReservationPage extends CrudPage<ReservationDetailModel> {
  // STATE ------------------------------------------------------------------------
  protected readonly selectFilterStatusId = signal<number>(0);
  protected readonly clearCounter = signal<number>(0);
  protected readonly getReservationByIdPayload = signal<number | null>(null);

  // SERVICES ----------------------------------------------------------------------
  private readonly reservationService = inject(ReservationService);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

  // RESERVATION STATE --------------------------------------------------------------
  protected readonly reservation = {
    dataList: computed<ReservationDetailModel[]>(() => this.getReservationRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getReservationRX.isLoading() && !this.getReservationRX.hasValue()),
    isSaving: signal<boolean>(false),
  }

  // RESERVATION DETAIL STATE -------------------------------------------------------
  protected readonly detail = {
    data: computed<ReservationDetailModel | null>(() => this.getReservationByIdRX.value() ?? null),
    isLoading: computed<boolean>(() => this.getReservationByIdRX.isLoading()),
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

      return this.reservationService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[ReservationService::AdminReservationPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  private readonly getReservationByIdRX = rxResource({
    params: () => this.getReservationByIdPayload(),
    stream: ({ params: id_reservation }) => {
      if (!id_reservation) return of(null);

      return this.reservationService.getById(id_reservation).pipe(
        catchError(err => {
          console.error('[ReservationService::AdminReservationPage] getById:', err);
          return of(null);
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS ---------------------------------------------------
  protected override reload(): void {
    this.getReservationRX.reload();
  }

  // RESERVATION ACTIONS -------------------------------------------------------------
  protected onClear(): void {
    this.clearCounter.update(e => e + 1);
    this.getReservationByIdPayload.set(null);
  }

  protected onSearchReservation(id_reservation: number): void {
    this.getReservationByIdPayload.set(id_reservation);
  }

  protected onRegisterReservationToLoan(item: ReservationDetailModel): void {
    const payload: ReservationPickupModel = {
      id_reservation: item.id_reservation,
      copy_id: item.copy_id,
    }

    this.mutation.run(
      this.reservationService.pickup(payload),
      { isSaving: this.reservation.isSaving },
      {
        successMsg: 'Reserva convertida a préstamo correctamente',
        errorMsg: 'Error al convertir la Reserva a préstamo',
        onSuccess: () => {
          this.reload();
          this.onClear();
        },
      }
    );
  }

  protected onUpdateExpireReservation(): void {
    this.mutation.run(
      this.reservationService.expire(),
      { isSaving: this.reservation.isSaving },
      {
        successMsg: 'Estado de Reservas actualizado correctamente',
        errorMsg: 'Error al actualizar el estado de las Reservas',
        onSuccess: () => this.reload(),
      }
    );
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