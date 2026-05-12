import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
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
  private readonly router = inject(Router);
  
  readonly isLoading = input<boolean>(false);
  readonly editionDetailList = input<EditionDetailModel[]>([]);

  protected navigateToEditionDetail(item: EditionDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.HOME.RESERVATION.ROOT(item.book_id, item.id_edition)]);
  }
}
