import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { BookDetailModel } from '@features/book/models/book-detail-model';

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
}
