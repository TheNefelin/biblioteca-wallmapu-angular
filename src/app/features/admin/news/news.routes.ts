import { Routes } from "@angular/router";
import { NewsListPage } from "./pages/news-list-page/news-list-page";
import { NewsFormPage } from "./pages/news-form-page/news-form-page";

export const  NEWS_ROUTES: Routes = [
  {
    path: '',
    component: NewsListPage
  },
  {
    path: 'form',
    component: NewsFormPage
  }
]