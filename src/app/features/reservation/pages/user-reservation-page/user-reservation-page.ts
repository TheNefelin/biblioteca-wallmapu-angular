import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ReservationDetailModel, ReservationFilterModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, of } from 'rxjs';
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ReservationBarcodeComponents } from "@features/reservation/components/reservation-barcode-components/reservation-barcode-components";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';

@Component({
  selector: 'app-user-reservation-page',
  imports: [
    ReservationListComponents,
    SectionHeaderComponent,
    ReservationBarcodeComponents,
    LoanPolicyComponent
  ],
  templateUrl: './user-reservation-page.html',
})
export class UserReservationPage {
  protected readonly isSaving = signal<boolean>(false);
  protected readonly selectedReservation = signal<ReservationDetailModel | null>(null);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  private readonly reservationService = inject(ReservationService);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

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

  protected readonly isLoading = computed(() =>
    [
      this.getReservationRX,
    ].some(e => e.isLoading())
  );

  private readonly getReservationRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => {
      return this.reservationService.getByUserPagination(params).pipe(
        catchError(err => {
          console.error('[ReservationService::UserReservationPage] getByUserPagination:', err);
          return of(null);
        })
      );
    },
  });

  protected onSelectedReservation(item: ReservationDetailModel): void {
    if (item.reservation_status_id == 1) {
      this.selectedReservation.set(item);
      return;
    }

    this.selectedReservation.set(null);
  }

  protected reloadReservation(): void {
    this.getReservationRX.reload();
    this.selectedReservation.set(null);
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
