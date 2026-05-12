import { Component, effect, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";

@Component({
  selector: 'app-edition-search-component',
  imports: [
    GenreSelectComponents, 
    EditorialSelectComponents, 
    AuthorSelectComponents
  ],
  templateUrl: './edition-search-component.html',
})
export class EditionSearchComponent {
  readonly textTitle = input<string | null>(null);
  readonly textDescription = input<string | null>(null);
  readonly searchPlaceholder = input<string | null>(null);
  readonly onSearchChange = output<string>();
  readonly onAuthorIdSelected = output<number>();
  readonly onEditorialIdSelected = output<number>();
  readonly onGenreIdSelected = output<number>();

  protected readonly searchText = signal<string>('');
  protected readonly clearTrigger = signal<number>(0);

  protected searchChange(event: Event) {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  private readonly emitSearch = effect(() => {
    this.onSearchChange.emit(this.searchDebounced());
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
    this.onAuthorIdSelected.emit(0);
  }

  protected authorSelected(item: AuthorModel | null) {
    if (!item) return;
    if (!item.id_author || item.id_author === 0) return;

    this.onAuthorIdSelected.emit(item.id_author)
  }

  protected editorialSelected(id: number) {
    this.onEditorialIdSelected.emit(id)
  }

  protected genreSelected(id: number) {
    this.onGenreIdSelected.emit(id)
  }
}
