import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdminStatsModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';
import { UserRoleSelectComponents } from "@features/user-role/components/user-role-select-components/user-role-select-components";
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { CommuneSelectComponents } from "@features/division-commune/components/commune-select-components/commune-select-components";
import { ProvinceSelectComponents } from "@features/division-province/components/province-select-components/province-select-components";
import { RegionSelectComponents } from "@features/division-region/components/region-select-components/region-select-components";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { CopyStatusSelectComponents } from "@features/copy-status/components/copy-status-select-components/copy-status-select-components";
import { EditionSearchComponent } from "@features/edition/components/edition-search-component/edition-search-component";
import { ReservationStatusSelectComponents } from "@features/reservation-status/components/reservation-status-select-components/reservation-status-select-components";
import { LoanStatusSelectComponent } from "@features/loan-status/components/loan-status-select-component/loan-status-select-component";
import { ButtonClearComponent } from "@shared/components/button-clear-component/button-clear-component";
import { ButtonDeleteComponent } from "@shared/components/button-delete-component/button-delete-component";
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { ButtonEditComponent } from "@shared/components/button-edit-component/button-edit-component";
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { ButtonGobackComponent } from "@shared/components/button-goback-component/button-goback-component";
import { ButtonSearchComponent } from "@shared/components/button-search-component/button-search-component";
import { ButtonNotificationComponent } from "@shared/components/button-notification-component/button-notification-component";
import { NotificationBellComponents } from "@features/notification/components/notification-bell-components/notification-bell-components";

@Component({
  selector: 'app-stat.page',
  imports: [
    UserRoleSelectComponents,
    UserStatusSelectComponents,
    CommuneSelectComponents,
    ProvinceSelectComponents,
    RegionSelectComponents,
    EditorialSelectComponents,
    AuthorSelectComponents,
    SubjectSelectComponents,
    GenreSelectComponents,
    CopyStatusSelectComponents,
    EditionSearchComponent,
    ReservationStatusSelectComponents,
    LoanStatusSelectComponent,
    ButtonClearComponent,
    ButtonDeleteComponent,
    ButtonRefreshComponent,
    ButtonEditComponent,
    ButtonCreateComponent,
    ButtonGobackComponent,
    ButtonSearchComponent,
    ButtonNotificationComponent,
    NotificationBellComponents
],
  templateUrl: './stat.page.html',
})
export class StatPage {
  private readonly statService = inject(StatService)
  private readonly backendError = signal<string | null>(null)

  private readonly statsRX = rxResource({
    stream: () => {
      this.backendError.set(null)

      return this.statService.getAdminStats().pipe(
        map(res => {
          if (!res.isSuccess) throw new Error(res.message || 'Unexpected error');
          return res.data;
        }),
        catchError(err => {
          const message =
            err?.error?.detail ||
            err?.error?.message ||
            err?.message ||
            'Unexpected error';

          this.backendError.set(message)
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.statsRX.isLoading());
  protected readonly errorMessage = computed(() => this.backendError() ?? null);
  readonly statsComputedList = computed<AdminStatsModel | null>(() => this.statsRX.value() ?? null);

}
