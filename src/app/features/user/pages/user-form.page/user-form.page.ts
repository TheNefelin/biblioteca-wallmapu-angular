import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Role } from '@shared/constants/roles-enum';
import { UpdateUserByAdminModel, UpdateUserModel, UserModel } from '@features/user/models/user-model';
import { AuthStore } from '@features/auth/services/auth-store';
import { AuthUser } from '@features/auth/models/auth-user';
import { extractErrorMessage } from '@core/utils/error-handler';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";

@Component({
  selector: 'app-user-form.page',
  imports: [
    SectionHeaderComponent,
    UserFormComponents,
    MessageErrorComponent,
    MessageSuccessComponent
  ],
  templateUrl: './user-form.page.html',
})
export class UserFormPage {
  private location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly userId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => String(params.get('id')) || null)
    ),
    { initialValue: null }
  );

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getUserRX,
      this.updateRX,
    ].some((e) => e.isLoading())
  );

  private readonly authStore = inject(AuthStore);
  protected readonly authUser = computed<AuthUser | null>(() => this.authStore.user());
  protected readonly isUser = computed<boolean>(() => this.authUser()?.role == Role.Reader)
  protected userPicture = computed<string | null>(() => {
    if (this.authUser()?.id_user == this.userId())
      return this.authUser()?.picture ?? null

    return null
  });

  private readonly userService = inject(UserService);
  private readonly getUserPayload = computed<string | null>(() => {
    if (this.authUser()?.role == Role.Admin)
      return this.userId();

    return this.authUser()?.id_user ??  null
  });
  private readonly submitPayload = signal<UpdateUserModel | UpdateUserByAdminModel | null>(null);
  protected readonly computedUser = computed<UserModel | null>(() => {
    const user = this.getUserRX.value()
    if(!user) return null

    return {
      id_user: user.id_user,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      rut: user.rut,
      address: user.address,
      phone: user.phone,
      created_at: user.created_at,
      updated_at: user.updated_at,
      commune_id: user.commune_id,
      user_role_id: user.user_role_id,
      user_status_id: user.user_status_id,
    }
  });

  private readonly getUserRX = rxResource({
    params: () => this.getUserPayload(),
    stream: ({ params: id_user }) => {
      if (!id_user) return of(null);
  
      return this.userService.getById(id_user).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly updateRX = rxResource({
    params: () => this.submitPayload(),
    stream: ({ params: payload }) => {
      if (!payload) return of(null);
  
      const request$ = this.isUser()
      ? this.userService.update_user(payload.id_user, payload as UpdateUserModel)
      : this.userService.update_admin(payload.id_user, payload as UpdateUserByAdminModel);
    
        return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  protected onFormSubmit(form: UserModel): void {
    const payload: UpdateUserModel | UpdateUserByAdminModel = this.isUser()
    ? {
        id_user: form.id_user,
        name: form.name,
        lastname: form.lastname,
        rut: form.rut,
        address: form.address,
        phone: form.phone,
        commune_id: form.commune_id,
      }
    : {
        id_user: form.id_user,
        name: form.name,
        lastname: form.lastname,
        rut: form.rut,
        address: form.address,
        phone: form.phone,
        commune_id: form.commune_id,
        user_role_id: form.user_role_id,
        user_status_id: form.user_status_id,
      };

      this.submitPayload.set(payload);
  }

  protected navigateBack(): void {
    this.location.back();
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
