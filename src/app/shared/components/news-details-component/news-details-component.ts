import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { NewsModel } from '@core/models/news-model';

@Component({
  selector: 'app-news-details-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './news-details-component.html',
})
export class NewsDetailsComponent {
  readonly news = input.required<NewsModel>();
}
