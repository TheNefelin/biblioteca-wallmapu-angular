import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-subject-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-select-component.html',
})
export class SubjectSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<SubjectModel | null>();

  private readonly subjectService = inject(SubjectService);
  protected readonly isLoading = computed(() => this.subjectRX.isLoading());
  protected readonly subjectList = computed<SubjectModel[]>(() => this.subjectRX.value() ?? []);

  private readonly subjectRX = rxResource({
    stream: () => {
      return this.subjectService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly subjectsToSelectItemsList = computed<SelectItem[]>(() => {
    return this.subjectList().map(s => ({ id: s.id_subject, name: s.name }));
  });

  protected selectItemToSubject(item: SelectItem): void {
    const selectedSubject = this.subjectList().find(e => e.id_subject === item.id);
    if (!selectedSubject) return;
    
    this.selectedItem.emit(selectedSubject);
  }
}
