import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { GenreService } from '@features/book-genre/services/genre-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-genre-select-components',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './genre-select-components.html',
})
export class GenreSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number | undefined>(undefined);
  readonly newSelectedId = output<number>();
  readonly clearTrigger = input<number>(0);

  private readonly genreService = inject(GenreService);

  private readonly genreRX = rxResource({
    stream: () => {
      return this.genreService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.data;
        }),
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed(() => this.genreRX.isLoading());
  protected readonly genreComputedList = computed<GenreModel[]>(() => this.genreRX.value() ?? []);

  protected readonly genreSelectItems = computed<SelectItem[]>(() => {
    return this.genreComputedList().map(g => ({ id: g.id_genre, name: g.name }));
  });

  protected onSelectionChange(item: SelectItem): void {
    this.newSelectedId.emit(item.id);
  }

  protected onCleared(): void {
    this.newSelectedId.emit(0);
  }
}
