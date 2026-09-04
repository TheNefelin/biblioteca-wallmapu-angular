import { Component, effect, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenreSelectComponent } from "@features/book-genre/components/genre-select-component/genre-select-component";
import { EditorialSelectComponent } from "@features/book-editorial/components/editorial-select-component/editorial-select-component";
import { AuthorSelectComponent } from "@features/book-author/components/author-select-component/author-select-component";
import { FormatSelectComponent } from "@features/format/components/format-select-component/format-select-component";
import { SubjectSelectComponent } from "@features/book-subject/components/subject-select-component/subject-select-component";
import { AuthorModel } from '@features/book-author/models/author-model';
import { FormatModel } from '@features/format/models/format-model';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-search-filter-component',
  imports: [
    GenreSelectComponent,
    EditorialSelectComponent,
    AuthorSelectComponent,
    FormatSelectComponent,
    SubjectSelectComponent
  ],
  templateUrl: './search-filter-component.html',
})
export class SearchFilterComponent {
  readonly textTitle = input<string | null>(null);
  readonly textDescription = input<string | null>(null);
  readonly searchPlaceholder = input<string | null>(null);
  readonly searchChange = output<string>();
  readonly selectedAuthor = output<AuthorModel | null>();
  readonly selectedFormat = output<FormatModel | null>();
  readonly selectedEditorial = output<EditorialModel | null>();
  readonly selectedGenre = output<GenreModel | null>();
  readonly selectedSubject = output<SubjectModel | null>();

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
    this.selectedAuthor.emit(null);
    this.selectedFormat.emit(null);
    this.selectedEditorial.emit(null);
    this.selectedGenre.emit(null);
    this.selectedSubject.emit(null);
  }
}