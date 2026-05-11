import { Component, computed, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminStatsModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-admin-stats-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './admin-stats-components.html',
})
export class AdminStatsComponents {  
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

  protected onNavigateToReservations(): void {
    this.navigateToReservations.emit();
  }

  protected onNavigateToLoans(): void {
    this.navigateToLoans.emit();
  }

  protected onNavigateToBooks(): void {
    this.navigateToBooks.emit();
  }

  protected onNavigateToUsers(): void {
    this.navigateToUsers.emit();
  }

  protected onNavigateToNews(): void {
    this.navigateToNews.emit();
  }
}
