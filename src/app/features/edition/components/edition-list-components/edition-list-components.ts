import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EditionDetailModel } from '@features/edition/models/edition-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-edition-list-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  
  readonly edit = output<EditionDetailModel>();
  readonly delete = output<EditionDetailModel>();

  protected onEdit(item: EditionDetailModel): void {
    this.edit.emit(item);
  }

  protected onDelete(item: EditionDetailModel): void {
    this.delete.emit(item);
  }
}
