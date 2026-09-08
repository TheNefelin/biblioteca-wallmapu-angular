import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminStatsModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-admin-stats-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent
  ],
  templateUrl: './admin-stats-component.html',
})
export class AdminStatsComponent {  
  private readonly statService = inject(StatService);
  protected readonly isLoading = computed(() => this.statRX.isLoading());
  protected readonly computedStats = computed<AdminStatsModel | null>(() => this.statRX.value() ?? null);

  readonly navigateToReservations = output<void>();
  readonly navigateToLoans = output<void>();
  readonly navigateToBooks = output<void>();
  readonly navigateToUsers = output<void>();
  readonly navigateToNews = output<void>();

  private readonly statRX = rxResource({
    stream: () => {    
      return this.statService.getAdminStats().pipe(
        catchError(() => of(null))
      );
    },
  });
}
