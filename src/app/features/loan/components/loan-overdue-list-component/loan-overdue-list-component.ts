import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-overdue-list-component',
  imports: [
    DatePipe,
    LoadingComponent
  ],
  templateUrl: './loan-overdue-list-component.html',
})
export class LoanOverdueListComponent {
  readonly isLoading = input<boolean>(false);
  readonly loanOverdueList = input<LoanDetailModel[]>([]);
  protected readonly navigateTo = output<void>();

  protected getDaysDiff(date: string | Date): number {
    const today = new Date();
    const dueDate = new Date(date);
  
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
  
    const diffMs = dueDate.getTime() - today.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
}