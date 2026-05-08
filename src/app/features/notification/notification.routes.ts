import { authGuard } from "@core/guards/auth-guard";
import { NotificationPage } from "@features/notification/pages/notification-page/notification-page";
import { Role } from "@shared/constants/roles-enum";
import { Routes } from "@angular/router";

export const  NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    component: NotificationPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  }
]
