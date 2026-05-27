import { Component, input, output } from '@angular/core';
import { FormatModel } from '@features/format/models/format-model';

@Component({
  selector: 'app-format-selected-list-component',
  imports: [],
  templateUrl: './format-selected-list-component.html',
})
export class FormatSelectedListComponent {
  readonly formatList = input<FormatModel[]>();
  readonly onDelete = output<FormatModel>();

  protected delete(item: FormatModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
  
    this.onDelete.emit(item);
  }
}
