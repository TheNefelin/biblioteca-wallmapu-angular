import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommuneService } from '@features/division-commune/services/commune-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-commune-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './commune-select-component.html',
})
export class CommuneSelectComponent {
  readonly selectedId = input<number | undefined>(undefined);
  readonly clearTrigger = input<number>(0);
  protected readonly selectedItem = output<CommuneModel | null>();

  private readonly communeService = inject(CommuneService);

  private readonly communeRX = rxResource({
    stream: () =>
      this.communeService.getAll().pipe(
        catchError(() => of([])),
      ),
  });

  protected readonly isLoading = computed(() => this.communeRX.isLoading());
  protected readonly communeComputedList = computed<CommuneModel[]>(() => this.communeRX.value() ?? []);

  protected readonly communeSelectItems = computed<SelectItem[]>(() => {
    return this.communeComputedList().map(c => ({ id: c.id_commune, name: c.name }));
  });

  protected onSelectionChange(item: SelectItem): void {
    const selected = this.communeComputedList().find(c => c.id_commune === item.id);
    if (selected) {
      this.selectedItem.emit(selected);
    }
  }
}