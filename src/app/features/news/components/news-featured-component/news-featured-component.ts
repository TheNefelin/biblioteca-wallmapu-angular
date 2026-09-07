import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { RouterLink } from "@angular/router";
import { NewsModel } from '@features/news/models/news-model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-news-featured-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
    RouterLink
],
  templateUrl: './news-featured-component.html',
})
export class NewsFeaturedComponent {
  readonly news = input<NewsModel | null>(null)
  readonly goToNews = computed(() => ROUTES_CONSTANTS.HOME.NEWS.DETAIL(this.news()?.id_news ?? 0));
}

