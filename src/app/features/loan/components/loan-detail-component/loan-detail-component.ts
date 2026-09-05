import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { LoanDetailModel } from '@features/loan/models/loan-model';

@Component({
  selector: 'app-loan-detail-component',
  imports: [
    DatePipe,
  ],
  templateUrl: './loan-detail-component.html',
})
export class LoanDetailComponent {
  readonly loanDetailModel = input<LoanDetailModel | null>(null);
}
