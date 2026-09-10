import { Component, effect, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { LoanDetailModel } from '@features/loan/models/loan-model';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { SearchCodbarComponent } from "@shared/components/search-codbar-component/search-codbar-component";
import { LoanDetailComponent } from "../loan-detail-component/loan-detail-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loan-to-return-component',
  imports: [
    ButtonComponent,
    SearchCodbarComponent,
    LoanDetailComponent,
    MessageErrorComponent,
    LoadingComponent,
  ],
  templateUrl: './loan-to-return-component.html',
})
export class LoanToReturnComponent {
  readonly loanDetailModel = input<LoanDetailModel | null>(null);
  readonly clearTrigger = input<number>(0);
  readonly isLoading = input<boolean>(false);
  protected readonly getLoanByBarcode = output<string>();
  protected readonly returnLoan = output<LoanDetailModel>()
  protected readonly clear = output<void>();

  protected readonly errorMessage = signal<string | null>(null);

  protected clearEffect = effect(() => {
    this.clearTrigger();
    this.errorMessage.set(null);
  });

  protected onEnterBookBarcode(barcode: string | null): void {
    if (!barcode) return;
    this.getLoanByBarcode.emit(barcode);
  }

  protected onReturnLoan(): void {
    const loan = this.loanDetailModel();
    if (!loan) return;

    this.returnLoan.emit(loan);
  }
}