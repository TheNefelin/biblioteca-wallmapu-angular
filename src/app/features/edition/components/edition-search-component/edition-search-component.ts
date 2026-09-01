import { Component, effect, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { FormatSelectComponent } from "@features/format/components/format-select-component/format-select-component";
import { FormatModel } from '@features/format/models/format-model';
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";
import { SubjectModel } from "@features/book-subject/models/subject-model";

@Component({
  selector: 'app-edition-search-component',
  imports: [
    GenreSelectComponents,
    EditorialSelectComponents,
    AuthorSelectComponents,
    FormatSelectComponent,
    SubjectSelectComponents
  ],
  templateUrl: './edition-search-component.html',
})
export class EditionSearchComponent {
  readonly textTitle = input<string | null>(null);
  readonly textDescription = input<string | null>(null);
  readonly searchPlaceholder = input<string | null>(null);
  readonly searchChange = output<string>();
  readonly authorIdSelected = output<number>();
  readonly formatIdSelected = output<number>();
  readonly editorialIdSelected = output<number>();
  readonly genreIdSelected = output<number>();
  readonly subjectIdSelected = output<number>();

  protected readonly searchText = signal<string>('');
  protected readonly clearTrigger = signal<number>(0);

  protected onSearchChange(event: Event) {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  private readonly emitSearch = effect(() => {
    this.searchChange.emit(this.searchDebounced());
  });

  private readonly searchDebounced = toSignal(
    toObservable(this.searchText).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  protected onClear(): void {
    this.clearTrigger.update(v => v + 1);
    this.searchText.set('');
    this.authorIdSelected.emit(0);
    this.formatIdSelected.emit(0);
    this.editorialIdSelected.emit(0);
    this.genreIdSelected.emit(0);
    this.subjectIdSelected.emit(0);
  }

  protected authorSelected(item: AuthorModel | null) {
    this.authorIdSelected.emit(item?.id_author ?? 0)
  }

  protected formatSelected(item: FormatModel | null): void {
    this.formatIdSelected.emit(item?.id_format ?? 0)
  }

  protected subjectSelected(item: SubjectModel | null): void {
    this.subjectIdSelected.emit(item?.id_subject ?? 0)
  }

  protected editorialSelected(id: number) {
    this.editorialIdSelected.emit(id)
  }

  protected genreSelected(id: number) {
    this.genreIdSelected.emit(id)
  }
}
