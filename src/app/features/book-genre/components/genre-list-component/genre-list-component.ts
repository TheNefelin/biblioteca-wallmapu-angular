import { Component, input, output } from '@angular/core';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { SearchInputComponent } from "@shared/components/search-input-component/search-input-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { GenreModel } from '@features/book-genre/models/genre-model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-genre-list-component',
  imports: [
    DatePipe,
    PaginationComponent, 
    ButtonComponent, 
    SearchInputComponent, 
    LoadingComponent],
  templateUrl: './genre-list-component.html',
})
export class GenreListComponent {
  readonly isLoading = input<boolean>(false);
  readonly genreList = input<GenreModel[]>([]);
  readonly currentPage = input<number>(0);
  readonly totalPages = input<number>(0);
  protected readonly prevPage = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly searchFilter = output<string>();
  protected readonly reload = output<void>();
  protected readonly create = output<void>();
  protected readonly edit = output<GenreModel>();
  protected readonly delete = output<GenreModel>();
}
