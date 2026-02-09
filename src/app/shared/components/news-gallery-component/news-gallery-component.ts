import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { NewsGalleryModel } from '@core/models/news-gallery-model';

@Component({
  selector: 'app-news-gallery-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './news-gallery-component.html',
})
export class NewsGalleryComponent {
  readonly newsGalleryList = input<NewsGalleryModel[]>([]);
}
