import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProvinceModel } from '@features/division-province/models/province-model';
import { ProvinceService } from '@features/division-province/services/province-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-province-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './province-select-component.html',
})
export class ProvinceSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<ProvinceModel | null>();

  private readonly provinceService = inject(ProvinceService);

  private readonly provinceRX = rxResource({
    stream: () => {
      return this.provinceService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed<boolean>(() => this.provinceRX.isLoading());
  protected readonly provinceComputedList = computed<ProvinceModel[]>(() => this.provinceRX.value() ?? []);

  protected readonly provinceToSelectItemsList = computed<SelectItem[]>(() => {
    return this.provinceComputedList().map(p => ({ id: p.id_province, name: p.province }));
  });

  protected onSelectionChange(item: SelectItem): void {
    const selected = this.provinceComputedList().find(p => p.id_province === item.id);
    if (selected) {
      this.selectedItem.emit(selected);
    }
  }
}