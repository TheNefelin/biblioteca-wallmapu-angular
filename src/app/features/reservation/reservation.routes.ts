import { Routes } from "@angular/router";
import { ReservationPage } from "@features/reservation/pages/reservation-page/reservation-page";

export const  RESERVATION_ROUTES: Routes = [
  {
    path: 'book/:bookId/edition/:editionId',
    component: ReservationPage,
  },
]
