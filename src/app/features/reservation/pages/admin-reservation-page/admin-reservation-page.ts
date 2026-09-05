import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ReservationDetailModel, ReservationFilterModel, ReservationPickupModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, of } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";
import { ReservationToLoanComponents } from "@features/reservation/components/reservation-to-loan-components/reservation-to-loan-components";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';

@Component({
  selector: 'app-admin-reservation-page',
  imports: [
    SectionHeaderComponent,
    ReservationListComponents,
    ReservationToLoanComponents,
    LoanPolicyComponent
  ],
  templateUrl: './admin-reservation-page.html',
})
export class AdminReservationPage {
  protected readonly clearCounter = signal<number>(0);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  protected readonly isLoadingReservation = computed<boolean>(() => this.getReservationByIdRX.isLoading());
  protected readonly isLoading = computed(() =>
    [
      this.getReservationRX,
      this.getReservationByIdRX,
    ].some(e => e.isLoading())
  );

  private readonly reservationService = inject(ReservationService);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);
  
  private readonly getReservationByIdPayload = signal<number | null>(null);
  private readonly getPaginationPayload = computed<PaginationRequestModel<ReservationFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        id_status: this.selectStatusId(),
      }
    }
  });
  protected readonly computedPaginationAndReservationList = computed<PaginationResponseModel<ReservationDetailModel[]> | null>(() => this.getReservationRX.value() ?? null);
  protected readonly computedReservationDetail = computed<ReservationDetailModel | null>(() => this.getReservationByIdRX.value() ?? null);
  
  private readonly getReservationRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => {
      return this.reservationService.getAllPagination(params).pipe(
        catchError(err => {
          console.error('[ReservationService::AdminReservationPage] getAllPagination:', err);
          return of(null);
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
      { isSaving: this.isSaving },
      {
        successMsg: 'Reserva convertida a préstamo correctamente',
        errorMsg: 'Error al convertir la Reserva a préstamo',
        onSuccess: () => {
          this.reloadReservation();
          this.onClear();
        },
      }
    );
  }

  protected reloadReservation(): void {
    this.getReservationRX.reload();
  }

  protected onUpdateExpireReservation(): void {
    this.mutation.run(
      this.reservationService.expire(),
      { isSaving: this.isSaving },
      {
        successMsg: 'Estado de Reservas actualizado correctamente',
        errorMsg: 'Error al actualizar el estado de las Reservas',
        onSuccess: () => this.reloadReservation(),
      }
    );
  }

  protected onFilterByIdStatus(id: number): void {
    this.selectStatusId.set(id);
  }

  nextPage() {
    const totalPages = this.computedPaginationAndReservationList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
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
      { isSaving: this.isSaving },
      {
        successMsg: 'Reserva eliminada correctamente',
        errorMsg: 'Error al cancelar la Reserva',
        onSuccess: () => this.reloadReservation(),
      }
    );
  }
}
