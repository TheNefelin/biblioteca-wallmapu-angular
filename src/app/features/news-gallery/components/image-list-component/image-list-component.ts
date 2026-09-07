import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Preview } from '@features/news-gallery/models/news-gallery-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-image-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
    ButtonComponent
  ],
  templateUrl: './image-list-component.html',
})
export class ImageListComponent {
  readonly isLoading = input<boolean>(false);
  readonly previewList = input<Preview[]>([]);
  protected readonly updateAlt = output<{ item: Preview, alt: string }>();
  protected readonly deleteImage = output<Preview>();

  protected onUpdateImageAlt(item: Preview, alt: string) {
    this.updateAlt.emit({ item, alt });
  }

  protected onDeleteImage(item: Preview): void {
    this.deleteImage.emit(item);
  }
}
