import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { AuthorFormComponent } from '@features/book-author/components/author-form-component/author-form-component';
import { AuthorListComponent } from '@features/book-author/components/author-list-component/author-list-component';
import { AuthorModel, SaveAuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';

@Component({
  selector: 'app-author-form-page',
  imports: [
    SectionHeaderComponent,
    AuthorFormComponent,
    AuthorListComponent,
  ],
  templateUrl: './author-form-page.html',
})
export class AuthorFormPage extends CrudPage<AuthorModel> {
  private location = inject(Location);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  // SERVICES ----------------------------------------------------------------------
  private authorService = inject(AuthorService);
  protected readonly author = {
    dataList: computed<AuthorModel[]>(() => this.getAllAuthorRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllAuthorRX.isLoading()),
    isSaving: signal<boolean>(false),
    showModal: signal<boolean>(false),
    selectedItem: signal<AuthorModel | null>(null),
  }

  // FETCHS ------------------------------------------------------------------------
  private readonly getAllAuthorRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.authorService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[AuthorService::AuthorFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllAuthorRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // AUTHOR ACTIONS -----------------------------------------------------------------
  protected onClearAuthorForm(): void {
    this.author.selectedItem.set(null);
    this.author.showModal.set(false);
  }

  protected onCreateAuthor(): void {
    this.author.selectedItem.set(null);
    this.author.showModal.set(true);
  }

  protected onEditAuthor(item: AuthorModel): void {
    this.author.selectedItem.set(item);
    this.author.showModal.set(true);
  }

  protected onSubmitAuthorForm(form: { id: number, data: SaveAuthorModel }): void {
    const id = form.id;
    const payload: SaveAuthorModel = form.data;

    this.mutation.run(
      id > 0
        ? this.authorService.update(id, payload)
        : this.authorService.create(payload),
      { isSaving: this.author.isSaving },
      {
        successMsg: id > 0
          ? `Autor: ${payload.name} modificado correctamente`
          : `Autor: ${payload.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Autor' : 'Error al crear el Autor',
        onSuccess: () => {
          this.onClearAuthorForm();
          this.reload();
        },
      }
    );
  }

  protected async onDeleteAuthor(item: AuthorModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Autor',
      message: `Estás seguro que deseas eliminar el Autor (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.authorService.delete(item.id_author),
      { isSaving: this.author.isSaving },
      {
        successMsg: `Autor: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Autor',
        onSuccess: () => this.reload(),
      }
    );
  }

  // ACTIONS -----------------------------------------------------------------------
  protected navigateBack(): void {
    this.location.back();
  }
}