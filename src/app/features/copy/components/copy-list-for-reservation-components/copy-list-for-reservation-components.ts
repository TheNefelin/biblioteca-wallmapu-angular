import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-copy-list-for-reservation-components',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
  ],
  templateUrl: './copy-list-for-reservation-components.html',
})
export class CopyListForReservationComponents {
  readonly isLoading = input<boolean>(false);
  readonly copyDetailList = input<CopyDetailModel[]>([])
  protected readonly onSelectedCopy = output<CopyDetailModel>();
}
