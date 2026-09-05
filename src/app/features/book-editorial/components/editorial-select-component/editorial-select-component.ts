import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-editorial-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editorial-select-component.html',
})
export class EditorialSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<EditorialModel | null>();

  private readonly editorialService = inject(EditorialService);
  protected readonly isLoading = computed(() => this.editorialRX.isLoading());
  protected readonly editorialList = computed<EditorialModel[]>(() => this.editorialRX.value() ?? []);

  private readonly editorialRX = rxResource({
    stream: () => {
      return this.editorialService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly editorialToSelectItemsList = computed<SelectItem[]>(() => {
    return this.editorialList().map(e => ({ id: e.id_editorial, name: e.name }));
  });

  protected selectItemToEditorial(item: SelectItem): void {
    const selectedEditorial = this.editorialList().find(e => e.id_editorial === item.id);
    if (!selectedEditorial) return;
    
    this.selectedItem.emit(selectedEditorial);
  }
}