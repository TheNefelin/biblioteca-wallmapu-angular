import { Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LoanStatusModel } from '@features/loan-status/models/loan-status-model';
import { LoanStatusService } from '@features/loan-status/services/loan-status-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-loan-status-select-component',
  imports: [
    LoadingComponent
  ],
  templateUrl: './loan-status-select-component.html',
})
export class LoanStatusSelectComponent {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  protected readonly isLoading = computed(() => this.loanStatusRX.isLoading());

  private readonly loanStatusService = inject(LoanStatusService);
  protected readonly computedLoanStatusList = computed<LoanStatusModel[]>(() => [
    { id_status: 0, name: 'Todos los Estados' },
    ...this.loanStatusRX.value() ?? []
  ]);

  private readonly loanStatusRX = rxResource({
    stream: () => {    
      return this.loanStatusService.getAll().pipe(
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
