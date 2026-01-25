import { Component } from '@angular/core';
import { BannerComponent } from '@features/public/home/components/banner-component/banner-component';
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { LatestNewsComponent } from '@features/public/home/components/latest-news-component/latest-news-component';
import { TitleComponent } from "@features/public/home/components/title-component/title-component";
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-home-page',
  imports: [
    BannerComponent,
    LatestNewsComponent,
    RecommendedBooksComponent,
    TitleComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly ROUTES = ROUTES;
}
