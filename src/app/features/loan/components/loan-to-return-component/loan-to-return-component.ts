import { Component, input, output } from '@angular/core';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { LoanDetailComponent } from "../loan-detail-component/loan-detail-component";

@Component({
  selector: 'app-loan-to-return-component',
  imports: [
    ButtonComponent,
    SearchCodbarComponent,
    LoanDetailComponent,
  ],
  templateUrl: './loan-to-return-component.html',
})
export class LoanToReturnComponent {
  readonly loanDetailModel = input<LoanDetailModel | null>(null);
  readonly clearTrigger = input<number>(0);
  readonly isLoading = input<boolean>(false);
  protected readonly onGetLoanByBarcode = output<string>();
  protected readonly onReturnLoan = output<LoanDetailModel>()
  protected readonly onClear = output<void>();
    
  protected onEnterBookBarcode(barcode: string | null): void {
    if (!barcode) return;
    this.onGetLoanByBarcode.emit(barcode);
  }
  
  protected returnLoan(): void {
    const loan = this.loanDetailModel();
    if (!loan) return;

    this.onReturnLoan.emit(loan);
  }
}
