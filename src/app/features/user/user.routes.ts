import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { UserFormPage } from "@features/user/pages/user-form.page/user-form.page";
import { UserListPage } from "@features/user/pages/user-list.page/user-list.page";
import { Role } from "@shared/constants/roles-enum";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserListPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
  {
    path: 'form/:id',
    component: UserFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]