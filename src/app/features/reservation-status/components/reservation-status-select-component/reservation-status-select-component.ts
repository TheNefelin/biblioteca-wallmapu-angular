import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReservationStatusModel } from '@features/reservation-status/models/reservation-status-model';
import { ReservationStatusService } from '@features/reservation-status/services/reservation-status-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-reservation-status-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reservation-status-select-component.html',
})
export class ReservationStatusSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<ReservationStatusModel | null>();

  private readonly reservationStatusService = inject(ReservationStatusService);
  protected readonly isLoading = computed(() => this.reservationStatusRX.isLoading());
  protected readonly reservationStatusList = computed<ReservationStatusModel[]>(() => this.reservationStatusRX.value() ?? []);

  private readonly reservationStatusRX = rxResource({
    stream: () => {
      return this.reservationStatusService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly reservationStatusToSelectItemsList = computed<SelectItem[]>(() => {
    return this.reservationStatusList().map(status => ({ id: status.id_status, name: status.name }));
  });

  protected selectItemToStatus(item: SelectItem): void {
    const selectedStatus = this.reservationStatusList().find(e => e.id_status === item.id);
    if (!selectedStatus) return;

    this.selectedItem.emit(selectedStatus);
  }
}