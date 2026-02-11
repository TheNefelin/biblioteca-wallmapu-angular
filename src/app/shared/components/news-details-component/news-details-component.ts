import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { NewsWithImagesModel } from '@core/models/news-model';

@Component({
  selector: 'app-news-details-component',
  imports: [
    NgOptimizedImage,
    DatePipe,
  ],
  templateUrl: './news-details-component.html',
})
export class NewsDetailsComponent {
  readonly news = input.required<NewsWithImagesModel>();
}
