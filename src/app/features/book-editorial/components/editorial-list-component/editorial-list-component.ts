import { Component, effect, input, output, signal } from '@angular/core';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { SearchInputComponent } from "@shared/components/search-input-component/search-input-component";
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editorial-list-component',
  imports: [
    DatePipe,
    PaginationComponent, 
    ButtonDeleteComponent, 
    ButtonEditComponent, 
    LoadingComponent, 
    SearchInputComponent, 
    ButtonRefreshComponent
  ],
  templateUrl: './editorial-list-component.html',
})
export class EditorialListComponent {
  readonly isLoading = input<boolean>(false);
  readonly paginationEditorialList = input<PaginationResponseModel<EditorialModel[]> | null>(null);
  protected readonly onDelete = output<EditorialModel>();
  protected readonly onReload = output<void>();
  protected readonly onPrevPage = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onEdit = output<EditorialModel>();
  protected readonly onSearch = output<string>();

  protected readonly totalPages = signal<number>(1);
  
  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationEditorialList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });
}
