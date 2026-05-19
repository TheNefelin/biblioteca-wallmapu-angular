import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { EditorialFormPage } from "@features/book-editorial/pages/editorial-form-page/editorial-form-page";
import { Role } from "@shared/constants/roles-enum";

export const  BOOK_EDITORIAL_ROUTES: Routes = [
  {
    path: '',
    component: EditorialFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]
