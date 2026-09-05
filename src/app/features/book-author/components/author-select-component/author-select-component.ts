import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-author-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './author-select-component.html',
})
export class AuthorSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<AuthorModel | null>();

  private readonly authorService = inject(AuthorService);
  protected readonly isLoading = computed(() => this.authorRX.isLoading());
  protected readonly authorList = computed<AuthorModel[]>(() => this.authorRX.value() ?? []);

  private readonly authorRX = rxResource({
    stream: () => {
      return this.authorService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });


  protected readonly authorToSelectItemsList = computed<SelectItem[]>(() => {
    return this.authorList().map(e => ({ id: e.id_author, name: e.name }));
  });

  protected selectItemToAuthor(item: SelectItem): void {
    const selectedSubject = this.authorList().find(e => e.id_author === item.id);
    if (!selectedSubject) return;
    
    this.selectedItem.emit(selectedSubject);
  }
}
