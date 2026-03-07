import { Component, input, output } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';

@Component({
  selector: 'app-author-list-components',
  imports: [],
  templateUrl: './author-list-components.html',
})
export class AuthorListComponents {
  readonly authorList = input<AuthorModel[]>();
  readonly onDelete = output<AuthorModel>();

  protected delete(item: AuthorModel): void {
    this.onDelete.emit(item);
  }
}
