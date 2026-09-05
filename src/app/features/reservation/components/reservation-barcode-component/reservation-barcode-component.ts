import { Component, input } from '@angular/core';
import { ReservationDetailModel } from '@features/reservation/models/reservation-model';
import { BarcodeGeneratorComponent } from "@shared/components/barcode-generator.component/barcode-generator.component";
import { ReservationDetailComponent } from "../reservation-detail-component/reservation-detail-component";

@Component({
  selector: 'app-reservation-barcode-component',
  imports: [
    BarcodeGeneratorComponent,
    ReservationDetailComponent
],
  templateUrl: './reservation-barcode-component.html',
})
export class ReservationBarcodeComponent {
  readonly reservationDetail = input<ReservationDetailModel | null>(null); 
}