import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserRoleModel } from '@features/user-role/models/user-role-model';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { SearchSelectComponent, SelectItem } from '@shared/components/search-select-component/search-select-component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-role-select-component',
  standalone: true,
  imports: [SearchSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-role-select-component.html',
})
export class UserRoleSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly selectedId = input<number | undefined>(undefined);
  protected readonly selectedItem = output<UserRoleModel | null>();

  private readonly userRoleService = inject(UserRoleService);
  protected readonly isLoading = computed(() => this.userRoleRX.isLoading());
  protected readonly userRoleList = computed<UserRoleModel[]>(() => this.userRoleRX.value() ?? []);

  private readonly userRoleRX = rxResource({
    stream: () => {
      return this.userRoleService.getAll().pipe(
        catchError(() => of([])),
      );
    },
  });

  protected readonly userRoleToSelectItemsList = computed<SelectItem[]>(() => {
    return this.userRoleList().map(role => ({ id: role.id_user_role, name: role.name }));
  });

  protected selectItemToRole(item: SelectItem): void {
    const selectedRole = this.userRoleList().find(e => e.id_user_role === item.id);
    if (!selectedRole) return;

    this.selectedItem.emit(selectedRole);
  }
}