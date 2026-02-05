import { Component, input } from '@angular/core';
import { News } from '@shared/models/news';
import { NewsCardComponent } from "@shared/components/news-card-component/news-card-component";

@Component({
  selector: 'app-news-list-component',
  imports: [
    NewsCardComponent
],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent {
  readonly newsList = input.required<News[]>();
}
