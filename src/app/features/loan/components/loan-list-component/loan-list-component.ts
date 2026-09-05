import { DatePipe } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { LoanStatusSelectComponent } from "@features/loan-status/components/loan-status-select-component/loan-status-select-component";

@Component({
  selector: 'app-loan-list-component',
  imports: [
    DatePipe,
    LoadingComponent,
    ButtonComponent,
    PaginationComponent,
    LoanStatusSelectComponent
],
  templateUrl: './loan-list-component.html',
})
export class LoanListComponent {
  readonly isLoading = input<boolean>(false);
  readonly selectStatusId = input<number>(0);
  readonly paginationAndLoanList = input<PaginationResponseModel<LoanDetailModel[]> | null>(null);
  protected readonly onSelectedIdStatus = output<number>();
  protected readonly onReload = output<void>();
  protected readonly onNextPage = output<void>();
  protected readonly onPrevPage = output<void>();

  protected readonly totalPages = signal<number>(1);

  protected readonly updateTotalPagesEffect = effect(() => {
    const data = this.paginationAndLoanList();
    if (data?.pages) {
      this.totalPages.set(data.pages);
    }
  });
}