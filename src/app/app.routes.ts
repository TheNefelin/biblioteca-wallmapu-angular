import { Routes } from '@angular/router';
import { PublicLayout } from '@layouts/public-layout/public-layout';
import { NotFoundPage } from '@shared/pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('@features/public/home/home.routes').then(m => m.HOME_ROUTES),
      },
      {
        path: 'library',
        loadChildren: () => import('@features/public/library/library.routes').then(m => m.LIBRARY_ROUTES),
      },
      {
        path: 'news',
        loadChildren: () => import('@features/public/news/news.routes').then(m => m.NEWS_ROUTES),
      },
      {
        path: 'palette',
        loadChildren: () => import('@features/public/palette/palette.routes').then(m => m.PALETTE_ROUTES),
      },
    ]
  },
  {
    path: '**',
    component: NotFoundPage
  }
];
