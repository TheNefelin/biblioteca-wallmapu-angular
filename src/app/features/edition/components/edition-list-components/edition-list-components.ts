import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EditionModel } from '@features/edition/models/edition-model';
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
  readonly editionList = input.required<EditionModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly onEdit = output<EditionModel>();
  readonly onDelete = output<EditionModel>();

  protected edit(item: EditionModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: EditionModel): void {
    this.onDelete.emit(item);
  }
}
