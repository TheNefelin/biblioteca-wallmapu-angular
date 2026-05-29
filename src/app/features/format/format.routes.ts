import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { FormatFormPage } from "@features/format/pages/format-form-page/format-form-page";
import { Role } from "@shared/constants/roles-enum";

export const FORMAT_ROUTES: Routes = [
  {
    path: '',
    component: FormatFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
