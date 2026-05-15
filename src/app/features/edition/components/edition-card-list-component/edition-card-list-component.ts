import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BookNotFoundPage } from "@core/pages/book-not-found-page/book-not-found-page";
import { EditionDetailModel } from '@features/edition/models/edition-model';

@Component({
  selector: 'app-edition-card-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    BookNotFoundPage
  ],
  templateUrl: './edition-card-list-component.html',
})
export class EditionCardListComponent {
  readonly isLoading = input<boolean>(false);
  readonly editionDetailList = input<EditionDetailModel[]>([]);
  protected readonly navigateTo = output<EditionDetailModel>();
}
