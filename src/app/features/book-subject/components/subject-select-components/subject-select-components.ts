import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-subject-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './subject-select-components.html',
})
export class SubjectSelectComponents {
  // ─── Inputs/Outputs ─────────────────────────────
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();  

  // ─── Estado interno ─────────────────────────────
  protected readonly isOpen = signal(false);
  protected readonly searchText = signal('');
  protected readonly selectedSubject = signal<SubjectModel | null>(null);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // ─── Servicio ───────────────────────────────────
  private readonly subjectService = inject(SubjectService);

  private readonly subjectlRX = rxResource({
    stream: () => {
      return this.subjectService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        catchError(err => {
          return of(null);
        }),
      );
    },
  });

  protected readonly isLoading = computed(() => this.subjectlRX.isLoading());
  protected readonly subjectComputedList = computed<SubjectModel[]>(() => this.subjectlRX.value() ?? []);

  // ─── Sincronización inicial ─────────────────────
  private readonly syncInitial = effect(() => {
    const id = this.selectedId();
    const list = this.subjectComputedList();
    if (id && list?.length) {
      const found = list.find((a) => a.id_subject === id);
      if (found) this.selectedSubject.set(found);
    }
  });

  // ─── Computeds ──────────────────────────────────
  protected readonly selectedSubjectName = computed(() => {
    const sel = this.selectedSubject();
    return sel?.name ?? null;
  });

  protected readonly filteredSubject = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const list = this.subjectComputedList();
    if (!term) return list;
    return list.filter((a) => a.name.toLowerCase().includes(term));
  });

  // ─── Handlers ──────────────────────────────────
  protected onSearch(value: string) {
    this.searchText.set(value);
    this.isOpen.set(true);
    if (this.selectedSubject() && value !== this.selectedSubject()!.name) {
      this.selectedSubject.set(null);
    }
  }

  protected select(author: SubjectModel, event: MouseEvent) {
    event.preventDefault();
    this.selectedSubject.set(author);
    this.searchText.set('');
    this.isOpen.set(false);
    this.inputRef()?.nativeElement.blur();
    this.newSelectedId.emit(author.id_subject);
  }

  protected clearSelection(event: MouseEvent) {
    event.preventDefault();
    this.selectedSubject.set(null);
    this.searchText.set('');
    this.newSelectedId.emit(0);
  }

  protected onBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      if (!this.selectedSubject()) this.searchText.set('');
    }, 150);
  }

  protected highlight(text: string): string {
    const term = this.searchText().trim();
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(
      regex,
      '<mark class="bg-primary/20 text-primary font-semibold rounded">$1</mark>'
    );
  }
}
