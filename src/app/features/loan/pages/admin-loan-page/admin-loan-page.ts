import { LoggerService } from '@core/services/logger-service';
import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoanListComponent } from "@features/loan/components/loan-list-component/loan-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PaginationRequestModel } from '@shared/models/pagination-request-model';
import { LoanDetailModel, LoanFilterModel } from '@features/loan/models/loan-model';
import { LoanService } from '@features/loan/services/loan-service';
import { LoanToReturnComponent } from "@features/loan/components/loan-to-return-component/loan-to-return-component";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { MutationService } from '@core/services/mutation-service';
import { CrudPage } from '@shared/base/crud-page';
import { ButtonComponent } from '@shared/components/button-component/button-component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-loan-page',
  imports: [
    LoanListComponent,
    SectionHeaderComponent,
    LoanToReturnComponent,
    LoanPolicyComponent,
    ButtonComponent
  ],
  templateUrl: './admin-loan-page.html',
})
export class AdminLoanPage extends CrudPage<LoanDetailModel> {
  private readonly logger = inject(LoggerService);
  // STATE ------------------------------------------------------------------------
  protected readonly selectFilterStatusId = signal<number>(0);
  protected readonly clearCounter = signal<number>(0);
  protected readonly getLoanByCodebarPayload = signal<string | null>(null);

  // SERVICES ----------------------------------------------------------------------
  private readonly loanService = inject(LoanService);
  private readonly mutation = inject(MutationService);

  // LOAN STATE ----------------------------------------------------------------------
  protected readonly loan = {
    dataList: computed<LoanDetailModel[]>(() => this.getLoanRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getLoanRX.isLoading() && !this.getLoanRX.hasValue()),
    isSaving: signal<boolean>(false),
  }

  // LOAN DETAIL STATE ---------------------------------------------------------------
  protected readonly detail = {
    data: computed<LoanDetailModel | null>(() => this.getLoanByCodebarRX.value() ?? null),
    isLoading: computed<boolean>(() => this.getLoanByCodebarRX.isLoading()),
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

      return this.loanService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          this.logger.error('LoanService::AdminLoanPage', 'getAllPagination', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  private readonly getLoanByCodebarRX = rxResource({
    params: () => this.getLoanByCodebarPayload(),
    stream: ({ params: codebar }) => {
      if (!codebar) return of(null);

      return this.loanService.getByCopyBarCode(codebar).pipe(
        catchError(err => {
          this.logger.error('LoanService::AdminLoanPage', 'getByCopyBarCode', err);
          return of(null);
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS ---------------------------------------------------
  protected override reload(): void {
    this.getLoanRX.reload();
  }

  // LOAN ACTIONS ---------------------------------------------------------------------
  protected onClear(): void {
    this.clearCounter.update(e => e + 1);
    this.getLoanByCodebarPayload.set(null);
  }

  protected onSearchLoanByBarcode(codebar: string): void {
    this.getLoanByCodebarPayload.set(codebar);
  }

  protected onReturnLoan(item: LoanDetailModel): void {
    this.mutation.run(
      this.loanService.return(item.copy_id),
      { isSaving: this.loan.isSaving },
      {
        successMsg: 'Préstamo registrado correctamente',
        errorMsg: 'Error al registrar el préstamo',
        onSuccess: () => {
          this.reload();
          this.onClear();
        },
      }
    );
  }

  protected onUpdateExpireLoan(): void {
    this.mutation.run(
      this.loanService.expire(),
      { isSaving: this.loan.isSaving },
      {
        successMsg: 'Estado de Préstamos actualizado correctamente',
        errorMsg: 'Error al actualizar el estado de los Préstamos',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected onFilterByIdStatus(status: LoanStatusModel | null): void {
    this.selectFilterStatusId.set(status?.id_status ?? 0);
    this.currentPage.set(1);
  }
}