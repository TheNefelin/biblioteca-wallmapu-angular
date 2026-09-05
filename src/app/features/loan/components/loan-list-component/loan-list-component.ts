import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";
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
  readonly selectStatusId = input<number | undefined>(undefined);
  readonly loanList = input<LoanDetailModel[]>([]);
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  protected readonly selectedIdStatus = output<LoanStatusModel | null>();
  protected readonly reload = output<void>();
  protected readonly nextPage = output<void>();
  protected readonly prevPage = output<void>();
}