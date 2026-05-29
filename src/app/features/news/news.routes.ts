import { Routes } from "@angular/router";
import { NewsListPage } from "@features/news/pages/news-list-page/news-list-page";
import { NewsFormPage } from "@features/news/pages/news-form-page/news-form-page";
import { authGuard } from "@core/guards/auth-guard";
import { Role } from "@shared/constants/roles-enum";

export const  NEWS_ROUTES: Routes = [
  {
    path: '',
    component: NewsListPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
  {
    path: 'form/:id',
    component: NewsFormPage,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
  },
]