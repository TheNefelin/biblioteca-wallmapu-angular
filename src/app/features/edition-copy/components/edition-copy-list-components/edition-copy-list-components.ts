import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';
import { EditionCopyModel } from '@features/edition-copy/models/edition-copy-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-edition-copy-list-components',
  imports: 
  [
    DatePipe,
    NgOptimizedImage,
    LoadingComponent
  ],
  templateUrl: './edition-copy-list-components.html',
})
export class EditionCopyListComponents {
  readonly editionCopyModel = input.required<EditionCopyDetailModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly onEdit = output<EditionCopyDetailModel>();
  readonly onDelete = output<EditionCopyDetailModel>();

  protected edit(item: EditionCopyDetailModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: EditionCopyDetailModel): void {
    this.onDelete.emit(item);
  }
}
