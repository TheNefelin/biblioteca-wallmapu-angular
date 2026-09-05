import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { LoanStatusService } from '@features/loan-status/services/loan-status-service';
import { catchError, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-status-component',
  standalone: true,
  imports: [LoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loan-status-component.html',
})
export class LoanStatusComponent {
  protected readonly isLoading = computed(() => this.loanStatusRX.isLoading());

  private readonly loanStatusService = inject(LoanStatusService);
  protected readonly computedLoanStatusList = computed<LoanStatusModel[]>(() => this.loanStatusRX.value() ?? []);

  private readonly loanStatusRX = rxResource({
    stream: () => {
      return this.loanStatusService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });
}