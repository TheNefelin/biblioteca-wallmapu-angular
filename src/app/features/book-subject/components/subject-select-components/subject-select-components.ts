import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-subject-select-components',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-select-components.html',
})
export class SubjectSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly clearTrigger = input<number>(0);
  readonly onNewSelectedSubject = output<SubjectModel>();

  private readonly subjectService = inject(SubjectService);

  private readonly subjectRX = rxResource({
    stream: () => {
      return this.subjectService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.data;
        }),
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
    const subject = this.subjectComputedList().find(s => s.id_subject === item.id);
    if (subject) {
      this.onNewSelectedSubject.emit(subject);
    }
  }

  protected onCleared(): void {
    this.onNewSelectedSubject.emit(null as unknown as SubjectModel);
  }
}
