import { Component, input, output, signal } from '@angular/core';
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { ReservationDetailComponents } from "../reservation-detail-components/reservation-detail-components";
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-reservation-to-loan-components',
  imports: [
    SearchCodbarComponent,
    ReservationDetailComponents,
    ButtonComponent,
    MessageErrorComponent
  ],
  templateUrl: './reservation-to-loan-components.html',
})
export class ReservationToLoanComponents {
  readonly reservationDetail = input<ReservationDetailModel | null>(null);
  readonly clearTrigger = input<number>(0);
  readonly isLoading = input<boolean>(false);
  protected readonly onGetReservationById = output<number>();
  protected readonly onReservationToLoan = output<ReservationDetailModel>()
  protected readonly onClear = output<void>();

  protected readonly disabledInput = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onSearchReservation(barcode: string | null): void {
    if (!barcode) return;
  
    const clean = barcode.trim().replace(/-RES$/, '');
    const id_reservation = Number(clean);
    
    if (Number.isNaN(id_reservation)) {
      this.errorMessage.set("El codigo de barra debe ser numerico");
      return;
    }
    
    this.onGetReservationById.emit(id_reservation);
    this.disabledInput.set(false);
  }
  
  protected onEnterBookBarCode(barcode: string | null): void {
    this.errorMessage.set(null);

    const reservation = this.reservationDetail();
    if (!reservation) return;

    if (barcode != reservation.copy_barcode) {
      this.errorMessage.set("La Copia NO Coincide con la Reserva")
      return;
    }

    this.disabledInput.set(true);
  }

  protected reservationToLoan(): void {
    const reservation = this.reservationDetail();
    
    if (!reservation || !reservation.id_reservation || !reservation.copy_id) {
      this.errorMessage.set("Seleccione una reserva válida");
      return;
    }

    this.onReservationToLoan.emit(reservation);
  }
}
