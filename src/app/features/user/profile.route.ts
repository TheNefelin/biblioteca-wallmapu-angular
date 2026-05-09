import { Routes } from "@angular/router";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";
import { UserFormPage } from "@features/user/pages/user-form.page/user-form.page";
import { UserProfilePage } from "@features/user/pages/user-profile.page/user-profile.page";

export const PROFILE_ROUTES: Routes = [
  { 
    path: '', 
    component: UserProfilePage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Reader] }
  },
  { 
    path: 'form/:id', 
    component: UserFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin, Role.Reader] } 
  },
];
