import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { EditionModel } from '@features/edition/models/edition-model';

@Component({
  selector: 'app-book-list-row-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './book-list-row-component.html',
})
export class BookListRowComponent {
  readonly bookDetail = input.required<BookDetailModel>();
  readonly delete = output<BookDetailModel>();
  readonly edit = output<BookDetailModel>();

  protected onDelete(item: BookDetailModel): void {
    this.delete.emit(item);
  }

  protected onEdit(item: BookDetailModel): void {
    this.edit.emit(item);
  }

  get totalCopies(): number {
    const book = this.bookDetail();

    // Si no hay ediciones, devolvemos 0
    if (!book?.editions || book.editions.length === 0) return 0;

    // Reducimos todas las ediciones sumando la cantidad de copies
    return book.editions.reduce(
      (sum: number, edition: EditionDetailModel) => sum + (edition.copies?.length ?? 0),
      0
    );
  }
}
