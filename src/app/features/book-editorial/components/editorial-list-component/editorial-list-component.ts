import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';
import { PaginationComponent } from '@shared/components/pagination-component/pagination-component';
import { SearchInputComponent } from '@shared/components/search-input-component/search-input-component';

@Component({
  selector: 'app-editorial-list-component',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
    PaginationComponent,
    SearchInputComponent,
  ],
  templateUrl: './editorial-list-component.html',
})
export class EditorialListComponent {
  readonly isLoading = input<boolean>(false);
  readonly editorialList = input<EditorialModel[]>([]);
  readonly currentPage = input<number>(0);
  readonly totalPages = input<number>(0);
  protected readonly prevPage = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly searchFilter = output<string>();
  protected readonly reload = output<void>();
  protected readonly create = output<void>();
  protected readonly edit = output<EditorialModel>();
  protected readonly delete = output<EditorialModel>();
}
