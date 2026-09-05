import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormatModel } from '@features/format/models/format-model';
import { FormatService } from '@features/format/services/format-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-format-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './format-select-component.html',
})
export class FormatSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<FormatModel | null>();

  private readonly formatService = inject(FormatService);
  protected readonly isLoading = computed(() => this.formatRX.isLoading());
  protected readonly formatList = computed<FormatModel[]>(() => this.formatRX.value() ?? []);

  private readonly formatRX = rxResource({
    stream: () => {
      return this.formatService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly formatToSelectItemsList = computed<SelectItem[]>(() => {
    return this.formatList().map(e => ({ id: e.id_format, name: e.name }));
  });

  protected selectItemToFormat(item: SelectItem): void {
    const selectedFormat = this.formatList().find(e => e.id_format === item.id);
    if (!selectedFormat) return;
    
    this.selectedItem.emit(selectedFormat);
  }
}