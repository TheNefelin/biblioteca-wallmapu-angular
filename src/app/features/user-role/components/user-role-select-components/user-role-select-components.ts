import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { UserRoleModel } from '@features/user-role/models/user-role-model';

@Component({
  selector: 'app-user-role-select-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent
  ],
  templateUrl: './user-role-select-components.html',
})
export class UserRoleSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly userRoleService = inject(UserRoleService);

  private readonly userRoleRX = rxResource({
    stream: () => {    
      return this.userRoleService.getAll().pipe(
        map(response => response),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.userRoleRX.isLoading());
  protected readonly userRoleComputedList = computed<UserRoleModel[]>(() => this.userRoleRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
