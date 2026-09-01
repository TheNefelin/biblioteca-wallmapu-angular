import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserStatusService } from '@features/user-status/services/user-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { UserStatusModel } from '@features/user-status/models/user-status-model';

@Component({
  selector: 'app-user-status-select-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent, 
  ],
  templateUrl: './user-status-select-components.html',
})
export class UserStatusSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly userStatusService = inject(UserStatusService);

  private readonly userStatusRX = rxResource({
    stream: () => {    
      return this.userStatusService.getAll().pipe(
        map(response => response),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.userStatusRX.isLoading());
  protected readonly userStatusComputedList = computed<UserStatusModel[]>(() => this.userStatusRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}

