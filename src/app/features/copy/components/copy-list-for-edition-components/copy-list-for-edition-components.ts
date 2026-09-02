import { DatePipe } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { CopyModel } from '@features/copy/models/copy-model';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { ModalBarcodeLabelComponent } from "@shared/components/modal-barcode-label-component/modal-barcode-label-component";

@Component({
  selector: 'app-copy-list-for-edition-components',
  imports: [
    DatePipe,
    LoadingComponent,
    ButtonComponent,
    ModalBarcodeLabelComponent
  ],
  templateUrl: './copy-list-for-edition-components.html',
})
export class CopyListForEditionComponents {
  readonly copyList = input.required<CopyModel[]>();
  readonly isLoading = input.required<boolean>();
  protected readonly refresh = output<void>();
  protected readonly create = output<void>();
  protected readonly edit = output<CopyModel>();
  protected readonly delete = output<CopyModel>();

  protected readonly openModal = signal<boolean>(false);
  protected readonly selectedBarcode = signal<string | null>(null);

  protected onSelectedBarcode(barcode: string): void {
    this.selectedBarcode.set(barcode)
    this.openModal.set(true);
  }
}
