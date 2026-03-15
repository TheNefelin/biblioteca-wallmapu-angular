import { Component, input } from '@angular/core';
import { NewsCardComponent } from "@features/news/components/news-card-component/news-card-component";
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';

@Component({
  selector: 'app-news-card-list-component',
  imports: [NewsCardComponent],
  templateUrl: './news-card-list-component.html',
})
export class NewsCardListComponent {
  readonly isLoading = input<boolean | null>(false);
  readonly newsWithImagesList = input.required<NewsWithImagesModel[]>();
}
