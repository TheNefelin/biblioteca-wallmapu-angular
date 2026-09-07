import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NewsModel } from '@features/news/models/news-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-news-card-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    ButtonComponent
],
  templateUrl: './news-card-list-component.html',
})
export class NewsCardListComponent {
  private router = inject(Router);
  
  readonly isLoading = input<boolean | null>(false);
  readonly newsList = input<NewsModel[]>([]);

  protected navigateToNews(item: NewsModel): void {
    this.router.navigate([ROUTES_CONSTANTS.HOME.NEWS.DETAIL(item.id_news)]);
  }
}
