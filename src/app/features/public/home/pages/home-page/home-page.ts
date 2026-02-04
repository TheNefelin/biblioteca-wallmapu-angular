import { Component } from '@angular/core';
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { LatestNewsComponent } from '@features/public/home/components/latest-news-component/latest-news-component';
import { ROUTES } from '@shared/constants/routes';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";

@Component({
  selector: 'app-home-page',
  imports: [
    LatestNewsComponent,
    RecommendedBooksComponent,
    HeaderComponent,
    SectionHeaderComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly ROUTES = ROUTES;
}
