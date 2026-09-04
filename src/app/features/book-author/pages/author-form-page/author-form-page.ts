import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { AuthorFormComponents } from '@features/book-author/components/author-form-components/author-form-components';
import { AuthorModel, CreateAuthorModel, UpdateAuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';
import { PaginationComponent } from '@shared/components/pagination-component/pagination-component';
import { SearchInputComponent } from '@shared/components/search-input-component/search-input-component';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-author-form-page',
  imports: [
    DatePipe,
    SectionHeaderComponent,
    AuthorFormComponents,
    SearchInputComponent,
    LoadingComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './author-form-page.html',
})
export class AuthorFormPage extends CrudPage<AuthorModel> {
  private location = inject(Location);
  private service = inject(AuthorService);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  protected readonly isFormModalOpen = signal<boolean>(false);
  protected readonly selectedAuthor = signal<AuthorModel | null>(null);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly computedList = computed<AuthorModel[]>(() => this.getAllRX.value() ?? []);

  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.service.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[AuthorService::AuthorFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // Metodos de Herencia CrudPage ------------------------------------------------------------
  protected override reload(): void {
    this.getAllRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // Acciones --------------------------------------------------------------------------------
  protected onSelectedAuthor(item: AuthorModel): void {
    this.selectedAuthor.set(item);
    this.isFormModalOpen.set(true);
  }

  protected onClearForm(): void {
    this.selectedAuthor.set(null);
    this.isFormModalOpen.set(false);
  }

  protected onSubmitForm(form: AuthorModel): void {
    const id = form.id_author;
    const payload: CreateAuthorModel | UpdateAuthorModel = id > 0
      ? { id_author: id, name: form.name }
      : { name: form.name };

    this.mutation.run(
      id > 0
        ? this.service.update(id, payload as UpdateAuthorModel)
        : this.service.create(payload as CreateAuthorModel),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0
          ? `Autor: ${form.name} modificado correctamente`
          : `Autor: ${form.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Autor' : 'Error al crear el Autor',
        onSuccess: () => {
          this.onClearForm();
          this.reload();
        },
      }
    );
  }

  protected async onDelete(item: AuthorModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Autor',
      message: `Estás seguro que deseas eliminar el Autor (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.service.delete(item.id_author),
      { isSaving: this.isSaving },
      {
        successMsg: `Autor: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Autor',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected navigateBack(): void {
    this.location.back();
  }
}