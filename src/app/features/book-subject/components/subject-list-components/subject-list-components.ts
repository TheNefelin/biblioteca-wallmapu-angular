import { Component, input, output } from '@angular/core';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-subject-list-components',
  imports: [],
  templateUrl: './subject-list-components.html',
})
export class SubjectListComponents {
  readonly subjectList = input<SubjectModel[]>([]);
  readonly onDelete = output<SubjectModel>();

  protected delete(item: SubjectModel): void {
    this.onDelete.emit(item);
  }
}
