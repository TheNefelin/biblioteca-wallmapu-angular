import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormatModel } from '@features/format/models/format-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';
import { PaginationComponent } from '@shared/components/pagination-component/pagination-component';
import { SearchInputComponent } from '@shared/components/search-input-component/search-input-component';

@Component({
  selector: 'app-format-list-component',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
    PaginationComponent,
    SearchInputComponent,
  ],
  templateUrl: './format-list-component.html',
})
export class FormatListComponent {
  readonly isLoading = input<boolean>(false);
  readonly formatList = input<FormatModel[]>([]);
  readonly currentPage = input<number>(0);
  readonly totalPages = input<number>(0);
  protected readonly prevPage = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly searchFilter = output<string>();
  protected readonly reload = output<void>();
  protected readonly create = output<void>();
  protected readonly edit = output<FormatModel>();
  protected readonly delete = output<FormatModel>();
}
