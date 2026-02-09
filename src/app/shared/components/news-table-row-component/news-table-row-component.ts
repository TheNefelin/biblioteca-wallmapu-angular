import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { NewsModel } from '@core/models/news-model';

@Component({
  selector: 'app-news-table-row-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './news-table-row-component.html',
})
export class NewsTableRowComponent {
  readonly news = input.required<NewsModel>();
}
