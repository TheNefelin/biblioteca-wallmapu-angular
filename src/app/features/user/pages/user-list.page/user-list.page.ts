import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { catchError, map, of } from 'rxjs';
import { UserListComponents } from "@features/user/components/user-list-components/user-list-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { AuthStore } from '@features/auth/services/auth-store';
import { Role } from '@shared/constants/roles-enum';
import { UserDetailModel } from '@features/user/models/user-model';
import { Router } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-list.page',
  imports: [
    SectionHeaderComponent,
    UserListComponents,
    MessageErrorComponent,
    PaginationComponent
],
  templateUrl: './user-list.page.html',
})
export class UserListPage {
  // SERVICIO DE FEATURE
  private readonly authStore = inject(AuthStore);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  
  readonly editRole = signal<Role>(this.authStore.user()?.role || Role.Reader);

  // ATRIBUTOS
  readonly currentPage = signal(1);
  private readonly items = signal<number>(10);
  readonly search = signal('');
  readonly totalPages = signal<number>(0);

  private readonly params = computed<PaginationRequestModel>(() => ({
    page: this.currentPage(),
    limit: this.items(),
    search: this.search(),
  })); 

  // FETCH
  private readonly dataResourceRX = rxResource({
    params: () => this.params(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.userService.getAllDetails(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.data.pages);
          return response.data.data;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  readonly isLoading = this.dataResourceRX.isLoading;
  readonly backendError = computed(() => this.dataResourceRX.error()?.message ?? null);
  
  // PROCESAR USER
  readonly userDetailListComputed = computed<UserDetailModel[] | []>(() => {
    const data = this.dataResourceRX.value();
    if (!data) return [];
    return data
  });

  searchText(text: string) {
    this.search.set(text);
    this.currentPage.set(1); 
  }
  
  nextPage() {
    if (this.currentPage() < this.totalPages()){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  protected onNavigateToEdit(user: UserDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.USERS.FORM(user.id_user)]);
  }
}
