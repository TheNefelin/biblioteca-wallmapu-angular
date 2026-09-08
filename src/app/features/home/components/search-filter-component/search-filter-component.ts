import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenreSelectComponent,
    EditorialSelectComponent,
    AuthorSelectComponent,
    FormatSelectComponent,
    SubjectSelectComponent,
  ],
  templateUrl: './search-filter-component.html',
})
export class SearchFilterComponent {
  readonly textTitle = input<string | null>(null);
  readonly textDescription = input<string | null>(null);
  readonly searchPlaceholder = input<string | null>(null);
  readonly limit = input<number>(20);
  readonly limitOptions = input<number[]>([20, 40, 60, 80, 100]);
  protected readonly searchChange = output<string>();
  protected readonly selectedAuthor = output<AuthorModel | null>();
  protected readonly selectedFormat = output<FormatModel | null>();
  protected readonly selectedEditorial = output<EditorialModel | null>();
  protected readonly selectedGenre = output<GenreModel | null>();
  protected readonly selectedSubject = output<SubjectModel | null>();
  protected readonly limitChange = output<number>();

  protected onLimitSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.limitChange.emit(value);
  }

  protected readonly searchText = signal<string>('');
  protected readonly clearTrigger = signal<number>(0);

  protected onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.searchChange.emit(value);
  }

  protected onClear(): void {
    this.clearTrigger.update(v => v + 1);
    this.searchText.set('');
    this.searchChange.emit('');
    this.selectedAuthor.emit(null);
    this.selectedFormat.emit(null);
    this.selectedEditorial.emit(null);
    this.selectedGenre.emit(null);
    this.selectedSubject.emit(null);
  }
}