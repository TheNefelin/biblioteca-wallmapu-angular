import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CopyStatusModel } from '@features/copy-status/models/copy-status-model';
import { CopyStatusService } from '@features/copy-status/services/copy-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-copy-status-component',
  imports: [LoadingComponent],
  templateUrl: './copy-status-component.html',
})
export class CopyStatusComponent {
  protected readonly isLoading = computed(() => this.copyStatusRX.isLoading());

  private readonly copyStatusService = inject(CopyStatusService);
  protected readonly computedCopyStatusList = computed<CopyStatusModel[]>(() => this.copyStatusRX.value() ?? []);

  private readonly copyStatusRX = rxResource({
    stream: () => {    
      return this.copyStatusService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });
}
