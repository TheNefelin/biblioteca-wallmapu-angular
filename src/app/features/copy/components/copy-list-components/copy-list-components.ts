import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonBarcodeComponent } from "@shared/components/button-barcode-component/button-barcode-component";
import { ModalBarcodeLabelComponent } from "@shared/components/modal-barcode-label-component/modal-barcode-label-component";

@Component({
  selector: 'app-copy-list-components',
  imports: [
    DatePipe,
    LoadingComponent,
    ButtonBarcodeComponent,
    ModalBarcodeLabelComponent
  ],
  templateUrl: './copy-list-components.html',
})
export class CopyListComponents {
  readonly isLoading = input.required<boolean>();
  readonly copyList = input.required<CopyDetailModel[]>();
  readonly onSelectCopy = output<number>();

  protected isModalOpen = signal<boolean>(false);
  protected readonly selectedBarcode = signal<string | null>(null);

  protected onSelectedBarcode(barcode: string): void {
    this.selectedBarcode.set(barcode)
    this.isModalOpen.set(true);
  }

  protected onModalClose(): void {
    this.isModalOpen.set(false);
  }
}
