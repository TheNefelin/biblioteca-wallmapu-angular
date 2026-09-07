import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsModel } from '@features/news/models/news-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-news-card-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './news-card-list-component.html',
})
export class NewsCardListComponent {
  readonly isLoading = input<boolean | null>(false);
  readonly newsList = input<NewsModel[]>([]);

  protected goToNews(item: NewsModel): string {
    return ROUTES_CONSTANTS.HOME.NEWS.DETAIL(item.id_news);
  }
}
