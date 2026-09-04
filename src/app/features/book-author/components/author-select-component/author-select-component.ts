import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-author-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './author-select-component.html',
})
export class AuthorSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  readonly clearTrigger = input<number>(0);

  private readonly authorService = inject(AuthorService);

  private readonly authorRX = rxResource({
    stream: () => {
      return this.authorService.getAll().pipe(
        map((res) => res),
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed(() => this.authorRX.isLoading());
  protected readonly authorComputedList = computed<AuthorModel[]>(() => this.authorRX.value() ?? []);

  protected readonly authorSelectItems = computed<SelectItem[]>(() => {
    return this.authorComputedList().map(e => ({ id: e.id_author, name: e.name }));
  });

  protected onSelectionChange(item: SelectItem): void {
    this.newSelectedId.emit(item.id);
  }

  protected onCleared(): void {
    this.newSelectedId.emit(0);
  }
}
