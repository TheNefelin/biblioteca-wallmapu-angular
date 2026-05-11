import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { AdminStatsComponents } from "@features/stats/components/admin-stats-components/admin-stats-components";
import { LoanOverdueListComponent } from "@features/loan/components/loan-overdue-list-component/loan-overdue-list-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { LoanService } from '@features/loan/services/loan-service';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoanPolicyComponent } from "@features/loan-policies/components/loan-policy-component/loan-policy-component";
import { LoanStatusComponent } from "@features/loan-status/components/loan-status-component/loan-status-component";
import { ReservationStatusComponent } from "@features/reservation-status/components/reservation-status-component/reservation-status-component";
import { CopyStatusComponent } from "@features/copy-status/components/copy-status-component/copy-status-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [
    SectionHeaderComponent,
    AdminStatsComponents,
    LoanOverdueListComponent,
    LoanPolicyComponent,
    LoanStatusComponent,
    ReservationStatusComponent,
    CopyStatusComponent
],
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage {
  private readonly router = inject(Router);
  protected readonly isLoading = computed<boolean>(() => this.getLoanOverdueRX.isLoading());
  private readonly loanService = inject(LoanService);
  protected readonly computedLoanOverdueList = computed<LoanDetailModel[]>(() => this.getLoanOverdueRX.value() ?? []);

  private readonly getLoanOverdueRX = rxResource({
    stream: () => { 
      return this.loanService.getAllOverdue().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected onNavigateToReservations(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.RESERVATION.ROOT]);
  }

  protected onNavigateToLoans(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.LOAN.ROOT]);
  }

  protected onNavigateToBooks(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.ROOT]);
  }

  protected onNavigateToUsers(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.ROOT]);
  }

  protected onNavigateToNews(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.ROOT]);
  }
}
