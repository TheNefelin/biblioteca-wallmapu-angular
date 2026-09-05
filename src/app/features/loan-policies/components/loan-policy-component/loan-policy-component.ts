import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoanPoliciesService } from '@features/loan-policies/services/loan-policies-service';
import { catchError, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-policy-component',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loan-policy-component.html',
})
export class LoanPolicyComponent {
  private readonly loanPoliciesService = inject(LoanPoliciesService);
  protected readonly computedLoanPolicy = computed<LoanPoliciesModel | null>(() => this.getLoanPolicyRX.value() ?? null);
  protected readonly isLoading = computed<boolean>(() => this.getLoanPolicyRX.isLoading());

  private readonly getLoanPolicyRX = rxResource({
    stream: () => {
      return this.loanPoliciesService.getDefault().pipe(
        catchError(() => of(null)),
      );
    },
  });
}