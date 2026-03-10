import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { EditionFormPage } from "@features/edition/pages/edition-form-page/edition-form-page";
import { Role } from "@shared/constants/roles-enum";

export const  EDITION_ROUTES: Routes = [
  {
    path: 'form',
    component: EditionFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]