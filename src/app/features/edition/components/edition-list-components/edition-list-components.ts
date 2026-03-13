import { DatePipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EditionFormModel } from '@features/edition/models/edition-form-model';
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
  readonly editionList = input.required<EditionFormModel[]>();
  readonly isLoading = input.required<boolean>();
  
  readonly onEdit = output<EditionFormModel>();
  readonly onDelete = output<EditionFormModel>();

  protected edit(item: EditionFormModel): void {
    this.onEdit.emit(item);
  }

  protected delete(item: EditionFormModel): void {
    this.onDelete.emit(item);
  }
}
