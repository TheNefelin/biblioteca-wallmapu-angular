import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanPoliciesModel } from '@features/loan-policies/models/loan-policies-model';
import { LoanPoliciesService } from '@features/loan-policies/services/loan-policies-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-loan-policy-component',
  imports: [
    LoadingComponent
  ],
  templateUrl: './loan-policy-component.html',
})
export class LoanPolicyComponent {
  protected readonly errorMessage = signal<string | null>(null);
  
  private readonly loanPoliciesService = inject(LoanPoliciesService);
  protected readonly computedLoanPolicy = computed<LoanPoliciesModel | null>(() => this.getLoanPolicyRX.value() ?? null);
  protected readonly isLoading = computed<boolean>(() => this.getLoanPolicyRX.isLoading());
  
  private readonly getLoanPolicyRX = rxResource({
    stream: () => {    
      return this.loanPoliciesService.getDefault().pipe(
        map(response => response),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });
  
  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
  }
}
