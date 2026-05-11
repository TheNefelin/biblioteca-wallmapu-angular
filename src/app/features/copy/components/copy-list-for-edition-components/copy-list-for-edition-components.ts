import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';

@Component({
  selector: 'app-copy-list-for-edition-components',
  imports: [
    DatePipe,
    LoadingComponent,
  ],
  templateUrl: './copy-list-for-edition-components.html',
})
export class CopyListForEditionComponents {
  readonly copyList = input.required<CopyDetailModel[]>();
  readonly isLoading = input.required<boolean>();
  readonly onEdit = output<CopyDetailModel>();
  readonly onDelete = output<CopyDetailModel>();
}
