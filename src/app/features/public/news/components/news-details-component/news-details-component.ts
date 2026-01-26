import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { News } from '@shared/models/news';

@Component({
  selector: 'app-news-details-component',
  imports: [
    NgOptimizedImage,
],
  templateUrl: './news-details-component.html',
})
export class NewsDetailsComponent {
  news = input.required<News>();
}
