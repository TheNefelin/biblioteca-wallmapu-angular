import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { BookListPage } from "@features/book/pages/book-list-page/book-list-page";
import { BookFormPage } from "@features/book/pages/book-form-page/book-form-page";

export const  BOOK_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: BookListPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
  {
    path: ':id_book',
    component: BookFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]