import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-subject-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-select-component.html',
})
export class SubjectSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly clearTrigger = input<number>(0);
  readonly newSelectedId = output<number>();

  private readonly subjectService = inject(SubjectService);

  private readonly subjectRX = rxResource({
    stream: () => {
      return this.subjectService.getAll().pipe(
        map((res) => res),
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed(() => this.subjectRX.isLoading());
  protected readonly subjectComputedList = computed<SubjectModel[]>(() => this.subjectRX.value() ?? []);

  protected readonly subjectSelectItems = computed<SelectItem[]>(() => {
    return this.subjectComputedList().map(s => ({ id: s.id_subject, name: s.name }));
  });

  protected onSelectionChange(item: SelectItem): void {
    this.newSelectedId.emit(item.id);
  }

  protected onCleared(): void {
    this.newSelectedId.emit(0);
  }
}
