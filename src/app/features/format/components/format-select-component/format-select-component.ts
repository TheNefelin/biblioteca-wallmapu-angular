import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormatModel } from '@features/format/models/format-model';
import { FormatService } from '@features/format/services/format-service';
import { SelectItem, SearchSelectComponent } from '@shared/components/search-select-component/search-select-component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-format-select-component',
  imports: [SearchSelectComponent],
  templateUrl: './format-select-component.html',
})
export class FormatSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly onNewSelectedFormat = output<FormatModel | null>();
  readonly clearTrigger = input<number>(0);

  private readonly formatService = inject(FormatService);

  private readonly formatRX = rxResource({
    stream: () => {
      return this.formatService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.data;
        }),
        catchError(() => of([])),
      );
    },
  });

  protected readonly isLoading = computed(() => this.formatRX.isLoading());
  protected readonly computedFormatList = computed<FormatModel[]>(() => this.formatRX.value() ?? []);

  protected readonly formatSelectItems = computed<SelectItem[]>(() => {
    return this.computedFormatList().map(e => ({ id: e.id_format, name: e.name }));
  });

  protected onSelectionChange(item: SelectItem): void {
    const author = this.computedFormatList().find(a => a.id_format === item.id);
    if (author) {
      this.onNewSelectedFormat.emit(author);
    }
  }

  protected onCleared(): void {
    this.onNewSelectedFormat.emit(null);
  }
}
