import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NewsModel } from '@features/news/models/news-model';
import { ModalImageComponent } from "@shared/components/modal-image-component/modal-image-component";

@Component({
  selector: 'app-news-detail-gallery-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    ModalImageComponent
],
  templateUrl: './news-detail-gallery-component.html',
})
export class NewsDetailGalleryComponent {
  readonly news = input<NewsModel | null>(null)

  readonly isImageModalOpen = signal(false);
  readonly selectedImage = signal("");
}
