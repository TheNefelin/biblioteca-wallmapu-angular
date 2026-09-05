import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { LoanStatusService } from '@features/loan-status/services/loan-status-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-loan-status-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loan-status-select-component.html',
})
export class LoanStatusSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<LoanStatusModel | null>();

  private readonly loanStatusService = inject(LoanStatusService);
  protected readonly isLoading = computed(() => this.loanStatusRX.isLoading());
  protected readonly loanStatusList = computed<LoanStatusModel[]>(() => this.loanStatusRX.value() ?? []);

  private readonly loanStatusRX = rxResource({
    stream: () => {
      return this.loanStatusService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly loanStatusToSelectItemsList = computed<SelectItem[]>(() => {
    return this.loanStatusList().map(status => ({ id: status.id_status, name: status.name }));
  });

  protected selectItemToStatus(item: SelectItem): void {
    const selectedStatus = this.loanStatusList().find(e => e.id_status === item.id);
    if (!selectedStatus) return;

    this.selectedItem.emit(selectedStatus);
  }
}