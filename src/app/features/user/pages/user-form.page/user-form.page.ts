import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UserFormComponent } from "@features/user/components/user-form-component/user-form-component";
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Role } from '@shared/constants/roles-enum';
import { UpdateUserByAdminModel, UpdateUserModel, UserModel } from '@features/user/models/user-model';
import { AuthStore } from '@features/auth/services/auth-store';
import { AuthUser } from '@features/auth/models/auth-user';
import { MutationService } from '@core/services/mutation-service';

@Component({
  selector: 'app-user-form.page',
  imports: [
    SectionHeaderComponent,
    UserFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-form.page.html',
})
export class UserFormPage {
  private location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mutation = inject(MutationService);

  readonly userId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => String(params.get('id')) || null)
    ),
    { initialValue: null }
  );

  protected readonly isLoading = computed<boolean>(() => this.getUserRX.isLoading());
  protected readonly isSaving = signal<boolean>(false);

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
        catchError(err => {
          console.error('[UserService::UserFormPage] getById:', err);
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

    this.mutation.run(
      this.isUser()
        ? this.userService.update_user(payload.id_user, payload as UpdateUserModel)
        : this.userService.update_admin(payload.id_user, payload as UpdateUserByAdminModel),
      { isSaving: this.isSaving },
      {
        successMsg: 'Usuario actualizado correctamente',
        errorMsg: 'Error al actualizar el usuario',
      }
    );
  }

  protected navigateBack(): void {
    this.location.back();
  }
}