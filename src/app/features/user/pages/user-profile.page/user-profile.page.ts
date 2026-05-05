import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { UserService } from '@features/user/services/user-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthStore } from '@features/auth/services/auth-store';
import { catchError, map, of } from 'rxjs';
import { UserProfileComponents } from "@features/user/components/user-profile-components/user-profile-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { UserDetailModel } from '@features/user/models/user-detail-model';
import { Role } from '@shared/constants/roles-enum';
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";

@Component({
  selector: 'app-user-profile.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    UserProfileComponents,
    MessageErrorComponent,
    NotificationListComponents
],
  templateUrl: './user-profile.page.html',
})
export class UserProfilePage {
  // SERVICIO USER OTRA FEATURE
  private readonly authStore = inject(AuthStore);
  readonly authUser = computed(() => ({
    userId: this.authStore.user()?.id_user,
    editRole: this.authStore.user()?.role ?? Role.Reader,
    picture: this.authStore.user()?.picture ?? 'images/book.png',
  }));

  private readonly userService = inject(UserService);

  private readonly dataResourceRX = rxResource({
    params: () => this.authUser().userId,
    stream: ({ params: id }) => {
      if (!id) return of(null);
  
      return this.userService.getById(id).pipe(
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

  readonly isLoading = this.dataResourceRX.isLoading();
  readonly backendError = computed(() => this.dataResourceRX.error()?.message ?? null);
  
  readonly errorMessage = computed(() => {
    if (this.backendError()) return this.backendError();
    if (this.isProfileIncomplete()) return "Debes completar tu perfil";
    return null;
  });

  readonly isProfileIncomplete = computed(() => {
    const user = this.dataResourceRX.value();
    if (!user) return false;
  
    return !(
      user.name &&
      user.lastname &&
      user.address &&
      user.rut &&
      user.phone
    );
  });

  // PROCESAR USER A USER PROFILE TYPE
  readonly userDetailComputed = computed<UserDetailModel | null>(() => {
    const user = this.dataResourceRX.value();
  
    if (!user) return null;

    return user
  });
  
}
