import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ReservationDetailModel, ReservationFilterModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { ReservationListComponents } from "@features/reservation/components/reservation-list-components/reservation-list-components";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ReservationBarcodeComponents } from "@features/reservation/components/reservation-barcode-components/reservation-barcode-components";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-user-reservation-page',
  imports: [
    ModalActionComponent,
    ReservationListComponents,
    SectionHeaderComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    ReservationBarcodeComponents,
    LoanPolicyComponent
  ],
  templateUrl: './user-reservation-page.html',
})
export class UserReservationPage {
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly selectedReservation = signal<ReservationDetailModel | null>(null);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  private readonly reservationService = inject(ReservationService);
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
  private readonly cancelReservationPayload = signal<number | null>(null);
  private readonly cancelReservationTemp = signal<number | null>(null);
  protected readonly computedPaginationAndReservationList = computed<PaginationResponseModel<ReservationDetailModel[]> | null>(() => this.getReservationRX.value() ?? null);

  protected readonly isLoading = computed(() => 
    [
      this.getReservationRX,
      this.cancelReservationRX,
    ].some(e => e.isLoading())
  );

  private readonly getReservationRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => { 

      return this.reservationService.getByUserPagination(params).pipe(
        map(response => response),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly cancelReservationRX = rxResource({
    params: () => this.cancelReservationPayload(),
    stream: ({ params: id_reservation }) => {    
      if (!id_reservation) return of(null);

      return this.reservationService.cancel(id_reservation).pipe(
        map(response => {
          this.successMessage.set('Reserva eliminada correctamente');
          return response;
        }),
        tap(() => {
          this.reloadReservation();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        }),
        finalize(() => {
          this.closeModal();
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

  protected onCancelReservation(id_reservation: number): void {
    this.cancelReservationTemp.set(id_reservation);
    this.isModalOpen.set(true);
  }

  protected onConfirmCancelReservation(): void {
    this.cancelReservationPayload.set(this.cancelReservationTemp());
  }

  protected closeModal(): void {
    this.cancelReservationTemp.set(null);
    this.cancelReservationPayload.set(null);
    this.isModalOpen.set(false);
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
