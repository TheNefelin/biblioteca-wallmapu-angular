import { Component, computed, inject, signal } from '@angular/core';
import { LoanListComponent } from "@features/loan/components/loan-list-component/loan-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { LoanDetailModel, LoanFilterModel } from '@features/loan/models/loan-model';
import { LoanService } from '@features/loan/services/loan-service';
import { LoanToReturnComponent } from "@features/loan/components/loan-to-return-component/loan-to-return-component";
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { MutationService } from '@core/services/mutation-service';

@Component({
  selector: 'app-admin-loan-page',
  imports: [
    LoanListComponent,
    SectionHeaderComponent,
    LoanToReturnComponent,
    LoanPolicyComponent
  ],
  templateUrl: './admin-loan-page.html',
})
export class AdminLoanPage {
  protected readonly clearCounter = signal<number>(0);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly selectStatusId = signal<number>(0);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  protected readonly isLoadingLoan = computed<boolean>(() => this.getLoanByCodebarRX.isLoading());
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getLoanRX,
    ].some(e => e.isLoading())
  );

  private readonly loanService = inject(LoanService);
  private readonly mutation = inject(MutationService);
  private readonly getLoanByCodebarPayload = signal<string | null>(null);
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
  protected readonly computedLoanDetail = computed<LoanDetailModel | null>(() => this.getLoanByCodebarRX.value() ?? null);

  private readonly getLoanRX = rxResource({
    params: () => this.getLoanPayload(),
    stream: ({ params }) => {
      return this.loanService.getAllPagination(params).pipe(
        catchError(err => {
          console.error('[LoanService::AdminLoanPage] getAllPagination:', err);
          return of(null);
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
          console.error('[LoanService::AdminLoanPage] getByCopyBarCode:', err);
          return of(null);
        })
      );
    },
  });

  protected onClear(): void {
    this.clearCounter.update(e => e + 1);
    this.getLoanByCodebarPayload.set(null);
  }

  protected onGetLoanByBarcode(codebar: string): void {
    this.getLoanByCodebarPayload.set(codebar);
  }

  protected onReturnLoan(item: LoanDetailModel): void {
    this.mutation.run(
      this.loanService.return(item.copy_id),
      { isSaving: this.isSaving },
      {
        successMsg: 'Préstamo registrado correctamente',
        errorMsg: 'Error al registrar el préstamo',
        onSuccess: () => this.onReloadLoan(),
      }
    );
    this.onClear();
  }

  protected onReloadLoan(): void {
    this.getLoanRX.reload();
    this.onClear();
  }

  protected onUpdateExpireLoan(): void {
    this.mutation.run(
      this.loanService.expire(),
      { isSaving: this.isSaving },
      {
        successMsg: 'Estado de Préstamos actualizado correctamente',
        errorMsg: 'Error al actualizar el estado de los Préstamos',
        onSuccess: () => this.onReloadLoan(),
      }
    );
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
}