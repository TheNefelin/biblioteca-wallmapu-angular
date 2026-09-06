import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { UserStatusService } from '@features/user-status/services/user-status-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-status-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-status-select-component.html',
})
export class UserStatusSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<UserStatusModel | null>();

  private readonly userStatusService = inject(UserStatusService);
  protected readonly isLoading = computed(() => this.userStatusRX.isLoading());
  protected readonly userStatusList = computed<UserStatusModel[]>(() => this.userStatusRX.value() ?? []);

  private readonly userStatusRX = rxResource({
    stream: () => {
      return this.userStatusService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly userStatusToSelectItemsList = computed<SelectItem[]>(() => {
    return this.userStatusList().map(status => ({ id: status.id_user_status, name: status.name }));
  });

  protected selectItemToStatus(item: SelectItem): void {
    const selectedStatus = this.userStatusList().find(e => e.id_user_status === item.id);
    if (!selectedStatus) return;

    this.selectedItem.emit(selectedStatus);
  }
}