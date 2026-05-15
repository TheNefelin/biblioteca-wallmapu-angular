import { Routes } from "@angular/router";
import { NewsPage } from "@features/news/pages/news-page/news-page";
import { NewsDetailPage } from "@features/news/pages/news-detail-page/news-detail-page";

export const  NEWS_ROUTES: Routes = [
  {
    path: '',
    component: NewsPage
  },
  {
    path: ':id',
    component: NewsDetailPage
  },
]