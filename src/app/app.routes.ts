import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { ForbiddenPage } from '@core/pages/forbidden-page/forbidden-page';
import { InDevelopmentPage } from '@core/pages/in-development-page/in-development-page';
import { NotFoundPage } from '@core/pages/not-found-page/not-found-page';
import { StatPage } from '@features/stats/pages/stat.page/stat.page';
import { LayoutAdmin } from '@layouts/layout-admin/layout-admin';
import { LayoutUser } from '@layouts/layout-user/layout-user';
import { Layout } from '@layouts/layout/layout';
import { Role } from '@shared/constants/roles-enum';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadChildren: () => import('@features/home/home.routes').then(m => m.HOME_ROUTES),
      },
      {
        path: 'reservation',
        loadChildren: () => import('@features/reservation/reservation.routes').then(m => m.RESERVATION_ROUTES),
      }
    ]
  },
  {
    path: 'admin',
    component: LayoutAdmin,
    canActivate: [authGuard],
    data: { roles: [Role.Admin] },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@features/dashboard/admin.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'notification',
        loadChildren: () => import('@features/notification/notification.routes').then(m => m.NOTIFICATION_ROUTES),
      },
      {
        path: 'reservation',
        loadChildren: () => import('@features/reservation/admin.reservation.routes').then(m => m.RESERVATION_ROUTES),
      },
      {
        path: 'loan',
        loadChildren: () => import('@features/loan/admin.loan.routes').then(m => m.LOAN_ROUTES),
      },
      {
        path: 'author',
        loadChildren: () => import('@features/book-author/book-author.routes').then(m => m.BOOK_AUTHOR_ROUTES),
      },
      {
        path: 'subject',
        loadChildren: () => import('@features/book-subject/book-subject.routes').then(m => m.BOOK_SUBJECT_ROUTES),
      },
      {
        path: 'genre',
        loadChildren: () => import('@features/book-genre/book-genre.routes').then(m => m.BOOK_GENRE_ROUTES),
      },
      {
        path: 'book',
        loadChildren: () => import('@features/book/book.routes').then(m => m.BOOK_ROUTES),
      },
      {
        path: 'edition',
        loadChildren: () => import('@features/edition/edition.routes').then(m => m.EDITION_ROUTES),
      },
      {
        path: 'copy',
        loadChildren: () => import('@features/copy/copy.routes').then(m => m.COPY_ROUTES),
      },
      {
        path: 'news',
        loadChildren: () => import('@features/news/news.routes').then(m => m.NEWS_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('@features/user/user.routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'profile',
        loadChildren: () => import('@features/user/profile.route').then(m => m.PROFILE_ROUTES)
      },
      {
        path: 'settings',
        component: StatPage
      },      
    ]
  },
  {
    path: 'user',
    component: LayoutUser,
    canActivate: [authGuard],
    data: { roles: [Role.Reader]},
    children: [
      {
        path: '',
        loadChildren: () => import('@features/dashboard/user.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'reservation',
        loadChildren: () => import('@features/reservation/user.reservation.routes').then(m => m.RESERVATION_ROUTES),
      },
      {
        path: 'loan',
        loadChildren: () => import('@features/loan/user.loan.routes').then(m => m.LOAN_ROUTES),
      },
      {
        path: 'profile',
        loadChildren: () => import('@features/user/profile.route').then(m => m.PROFILE_ROUTES)
      },
    ]
  },
  {
    path: 'forbidden',
    component: ForbiddenPage
  },
  {
    path: '**',
    component: NotFoundPage
  }
];
