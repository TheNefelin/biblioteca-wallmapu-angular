import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { GenreService } from '@features/book-genre/services/genre-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-genre-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './genre-select-component.html',
})
export class GenreSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<GenreModel | null>();

  private readonly genreService = inject(GenreService);
  protected readonly isLoading = computed(() => this.genreRX.isLoading());
  protected readonly genreList = computed<GenreModel[]>(() => this.genreRX.value() ?? []);

  private readonly genreRX = rxResource({
    stream: () => {
      return this.genreService.getAll().pipe(
        map((res) => res),
        catchError(() => of([])),
      );
    },
  });

  protected readonly genreToSelectItemsList = computed<SelectItem[]>(() => {
    return this.genreList().map(g => ({ id: g.id_genre, name: g.name }));
  });

  protected selectItemToGenre(item: SelectItem): void {
    const selectedGenre = this.genreList().find(e => e.id_genre === item.id);
    if (!selectedGenre) return;
    
    this.selectedItem.emit(selectedGenre);
  }
}