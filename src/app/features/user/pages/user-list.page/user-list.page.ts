import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { catchError, map, of } from 'rxjs';
import { UserListComponent } from "@features/user/components/user-list-component/user-list-component";
import { AuthStore } from '@features/auth/services/auth-store';
import { Role } from '@shared/constants/roles-enum';
import { UserDetailModel } from '@features/user/models/user-model';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { CrudPage } from '@shared/base/crud-page';

@Component({
  selector: 'app-user-list.page',
  imports: [
    SectionHeaderComponent,
    UserListComponent,
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.page.html',
})
export class UserListPage extends CrudPage<UserDetailModel> {
  // SERVICIO DE FEATURE
  private readonly authStore = inject(AuthStore);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly editRole = signal<Role>(this.authStore.user()?.role || Role.Reader);

  // FETCH
  private readonly getUserRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(this.emptyPaginated());

      return this.userService.getAllDetails(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[UserService::UserListPage] getAllPagination:', err);
          return of(this.emptyPaginated())
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.getUserRX.isLoading());

  // PROCESAR USER
  protected readonly userDetailListComputed = computed<UserDetailModel[]>(() => this.getUserRX.value() ?? []);

  // CRUD-PAGE INHERITANCE METHODS
  protected override reload(): void {
    this.getUserRX.reload();
  }

  protected onSearchChange(text: string): void {
    this.search.set(text);
    this.currentPage.set(1);
  }

  protected onNavigateToEdit(user: UserDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.FORM(user.id_user)]);
  }
}