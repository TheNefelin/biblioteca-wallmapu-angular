import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { BookDetailModel } from '@features/book/models/book-model';
import { DatePipe, NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-book-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    LoadingComponent,
  ],
  templateUrl: './book-list-component.html',
})
export class BookListComponent {
  readonly bookList = input.required<BookDetailModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly onEdit = output<BookDetailModel>();
  readonly onDelete = output<BookDetailModel>();
}
