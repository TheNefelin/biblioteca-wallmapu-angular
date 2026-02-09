import { Component, input } from '@angular/core';
import { NewsCardComponent } from "@shared/components/news-card-component/news-card-component";
import { NewsSkeletonComponent } from "@shared/components/news-skeleton-component/news-skeleton-component";
import { NewsModel } from '@core/models/news-model';

@Component({
  selector: 'app-news-list-component',
  imports: [
    NewsCardComponent,
    NewsSkeletonComponent
],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent {
  readonly newsList = input.required<NewsModel[]>();
  readonly loading = input<boolean | null>(true);
}
