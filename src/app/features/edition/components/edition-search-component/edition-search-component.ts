import { Component, effect, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenreSelectComponent } from "@features/book-genre/components/genre-select-component/genre-select-component";
import { EditorialSelectComponent } from "@features/book-editorial/components/editorial-select-component/editorial-select-component";
import { AuthorSelectComponent } from "@features/book-author/components/author-select-component/author-select-component";
import { FormatSelectComponent } from "@features/format/components/format-select-component/format-select-component";
import { SubjectSelectComponent } from "@features/book-subject/components/subject-select-component/subject-select-component";

@Component({
  selector: 'app-edition-search-component',
  imports: [
    GenreSelectComponent,
    EditorialSelectComponent,
    AuthorSelectComponent,
    FormatSelectComponent,
    SubjectSelectComponent
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

  protected authorSelected(id: number) {
    this.authorIdSelected.emit(id)
  }

  protected formatSelected(id: number): void {
    this.formatIdSelected.emit(id)
  }

  protected subjectSelected(id: number): void {
    this.subjectIdSelected.emit(id)
  }

  protected editorialSelected(id: number) {
    this.editorialIdSelected.emit(id)
  }

  protected genreSelected(id: number) {
    this.genreIdSelected.emit(id)
  }
}
