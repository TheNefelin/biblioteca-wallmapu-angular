import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RegionModel } from '@features/division-region/models/region-model';
import { RegionService } from '@features/division-region/services/region-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-region-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './region-select-component.html',
})
export class RegionSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<RegionModel | null>();

  private readonly regionService = inject(RegionService);

  private readonly regionRX = rxResource({
    stream: () => {
      return this.regionService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed<boolean>(() => this.regionRX.isLoading());
  protected readonly regionComputedList = computed<RegionModel[]>(() => this.regionRX.value() ?? []);

  protected readonly regionToSelectItemsList = computed<SelectItem[]>(() => {
    return this.regionComputedList().map(r => ({ id: r.id_region, name: r.region }));
  });

  protected onSelectionChange(item: SelectItem): void {
    const selected = this.regionComputedList().find(r => r.id_region === item.id);
    if (selected) {
      this.selectedItem.emit(selected);
    }
  }
}