import { Component, input, output } from '@angular/core';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-subject-selected-list-component',
  imports: [],
  templateUrl: './subject-selected-list-component.html',
})
export class SubjectSelectedListComponent {
  readonly subjectList = input<SubjectModel[]>();
  readonly delete = output<SubjectModel>();

  protected handleDelete(item: SubjectModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
    
    this.delete.emit(item);
  }
}