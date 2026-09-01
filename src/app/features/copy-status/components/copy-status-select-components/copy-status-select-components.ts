import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CopyStatusModel } from '@features/copy-status/models/copy-status-model';
import { CopyStatusService } from '@features/copy-status/services/copy-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-copy-status-select-components',
  imports: [LoadingComponent],
  templateUrl: './copy-status-select-components.html',
})
export class CopyStatusSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly copyStatusService = inject(CopyStatusService);
  protected readonly isLoading = computed<boolean>(() => this.getCopyStatusRX.isLoading());
  protected readonly computedCopyStatusList = computed<CopyStatusModel[]>(() => this.getCopyStatusRX.value() ?? []);

  private readonly getCopyStatusRX = rxResource({
    stream: () => {    
      return this.copyStatusService.getAll().pipe(
        map(response => response),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
