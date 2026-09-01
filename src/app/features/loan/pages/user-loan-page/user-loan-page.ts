import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { LoanDetailModel, LoanFilterModel } from '@features/loan/models/loan-model';
import { LoanService } from '@features/loan/services/loan-service';
import { catchError, map, of } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoanListComponent } from "@features/loan/components/loan-list-component/loan-list-component";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-user-loan-page',
  imports: [
    SectionHeaderComponent,
    MessageErrorComponent,
    LoanListComponent,
    LoanPolicyComponent,
  ],
  templateUrl: './user-loan-page.html',
})
export class UserLoanPage {
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() => this.getLoanRX.isLoading());

  private readonly loanService = inject(LoanService);
  private readonly getLoanPayload = computed<PaginationRequestModel<LoanFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        id_status: this.selectStatusId(),
      }
    }
  });
  protected readonly computedPaginationAndLoanList = computed<PaginationResponseModel<LoanDetailModel[]> | null>(() => this.getLoanRX.value() ?? null);
  
  private readonly getLoanRX = rxResource({
    params: () => this.getLoanPayload(),
    stream: ({ params }) => { 

      return this.loanService.getAllPaginationByUser(params).pipe(
        map(response => response),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  protected onReloadLoan(): void {
    this.getLoanRX.reload();
  }

  protected onFilterByIdStatus(id: number): void {
    this.selectStatusId.set(id);
  }

  nextPage() {
    const totalPages = this.computedPaginationAndLoanList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }
  
  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
  }
}