import { Component, input, output } from '@angular/core';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-subject-list-components',
  imports: [],
  templateUrl: './subject-list-components.html',
})
export class SubjectListComponents {
  readonly subjectList = input<SubjectModel[]>();
  readonly onDelete = output<SubjectModel>();

  protected delete(item: SubjectModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
    
    this.onDelete.emit(item);
  }
}
