import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-loan-overdue-list-component',
  imports: [
    DatePipe,
    LoadingComponent
],
  templateUrl: './loan-overdue-list-component.html',
})
export class LoanOverdueListComponent {
  private readonly router = inject(Router);

  readonly isLoading = input<boolean>(false);
  readonly loanOverdueList = input<LoanDetailModel[]>([]);

  protected getDaysDiff(date: string | Date): number {
    const today = new Date();
    const dueDate = new Date(date);
  
    // Normalizar (sin horas)
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
  
    const diffMs = dueDate.getTime() - today.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  protected navigateToLoan(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.RESERVATION.ROOT]); 
  }
}
