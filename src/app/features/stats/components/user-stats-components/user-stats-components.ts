import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserStatsModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-user-stats-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './user-stats-components.html',
})
export class UserStatsComponents {
  private readonly statService = inject(StatService);
  protected readonly isLoading = computed(() => this.statRX.isLoading());
  protected readonly computedStats = computed<UserStatsModel | null>(() => this.statRX.value() ?? null);

  private readonly statRX = rxResource({
    stream: () => {
      return this.statService.getUserStats().pipe(
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
