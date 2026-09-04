import { Component, input, output } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';

@Component({
  selector: 'app-author-selected-list-component',
  imports: [],
  templateUrl: './author-selected-list-component.html',
})
export class AuthorSelectedListComponent {
  readonly authorList = input<AuthorModel[]>();
  readonly delete = output<AuthorModel>();

  protected handleDelete(item: AuthorModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
  
    this.delete.emit(item);
  }
}
