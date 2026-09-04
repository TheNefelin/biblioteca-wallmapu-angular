import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EditionDetailModel } from '@features/edition/models/edition-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-edition-list-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    LoadingComponent,
    ButtonComponent
  ],
  templateUrl: './edition-list-components.html',
})
export class EditionListComponents {
  readonly editionDetailList = input.required<EditionDetailModel[]>();
  readonly isLoading = input.required<boolean>();
  readonly reload = output<void>();
  readonly create = output<void>();
  readonly edit = output<EditionDetailModel>();
  readonly delete = output<EditionDetailModel>();
}
