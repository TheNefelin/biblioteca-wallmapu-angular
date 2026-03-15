import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-edition-list-components',
  imports: [
    DatePipe,
    NgOptimizedImage,
    LoadingComponent
  ],
  templateUrl: './edition-list-components.html',
})
export class EditionListComponents {
  readonly editionDetailList = input.required<EditionDetailModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly onEdit = output<EditionDetailModel>();
  readonly onDelete = output<EditionDetailModel>();

  protected edit(item: EditionDetailModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: EditionDetailModel): void {
    this.onDelete.emit(item);
  }
}
