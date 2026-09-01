import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProvinceModel } from '@features/division-province/models/province-model';
import { ProvinceService } from '@features/division-province/services/province-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-province-select-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent
  ],
  templateUrl: './province-select-components.html',
})
export class ProvinceSelectComponents {
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();
  
  private readonly provinceService = inject(ProvinceService);

  private readonly provinceRX = rxResource({
    stream: () => {    
      return this.provinceService.getAll().pipe(
        map(response => response),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed<boolean>(() => this.provinceRX.isLoading());
  protected readonly provinceComputedList = computed<ProvinceModel[]>(() => this.provinceRX.value() ?? []);

  protected onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newId = Number(select.value); 
    this.newSelectedId.emit(newId); 
  }
}
