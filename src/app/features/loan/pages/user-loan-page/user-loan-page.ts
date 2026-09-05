import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { LoanDetailModel, LoanFilterModel } from '@features/loan/models/loan-model';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { LoanService } from '@features/loan/services/loan-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { LoanListComponent } from "@features/loan/components/loan-list-component/loan-list-component";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { CrudPage } from '@shared/base/crud-page';

@Component({
  selector: 'app-user-loan-page',
  imports: [
    SectionHeaderComponent,
    LoanListComponent,
    LoanPolicyComponent,
  ],
  templateUrl: './user-loan-page.html',
})
export class UserLoanPage extends CrudPage<LoanDetailModel> {
  // STATE ------------------------------------------------------------------------
  protected readonly selectFilterStatusId = signal<number>(0);

  // SERVICES ----------------------------------------------------------------------
  private readonly loanService = inject(LoanService);

  // LOAN STATE ----------------------------------------------------------------------
  protected readonly loan = {
    dataList: computed<LoanDetailModel[]>(() => this.getLoanRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getLoanRX.isLoading() && !this.getLoanRX.hasValue()),
  }

  // FETCHS -------------------------------------------------------------------------
  private readonly getPaginationPayload = computed<PaginationRequestModel<LoanFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        id_status: this.selectFilterStatusId(),
      }
    }
  });

  private readonly getLoanRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.loanService.getAllPaginationByUser(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[LoanService::UserLoanPage] getAllPaginationByUser:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS ---------------------------------------------------
  protected override reload(): void {
    this.getLoanRX.reload();
  }

  // LOAN ACTIONS ---------------------------------------------------------------------
  protected onFilterByIdStatus(status: LoanStatusModel | null): void {
    this.selectFilterStatusId.set(status?.id_status ?? 0);
    this.currentPage.set(1);
  }
}