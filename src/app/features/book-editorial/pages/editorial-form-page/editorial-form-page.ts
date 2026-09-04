import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { EditorialFormComponent } from '@features/book-editorial/components/editorial-form-component/editorial-form-component';
import { EditorialListComponent } from '@features/book-editorial/components/editorial-list-component/editorial-list-component';
import { EditorialModel, SaveEditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';

@Component({
  selector: 'app-editorial-form-page',
  imports: [
    SectionHeaderComponent,
    EditorialFormComponent,
    EditorialListComponent,
  ],
  templateUrl: './editorial-form-page.html',
})
export class EditorialFormPage extends CrudPage<EditorialModel> {
  private location = inject(Location);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  // SERVICES ----------------------------------------------------------------------
  private editorialService = inject(EditorialService);
  protected readonly editorial = {
    dataList: computed<EditorialModel[]>(() => this.getAllEditorialRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllEditorialRX.isLoading()),
    isSaving: signal<boolean>(false),
    showModal: signal<boolean>(false),
    selectedItem: signal<EditorialModel | null>(null),
  }

  // FETCHS ------------------------------------------------------------------------
  private readonly getAllEditorialRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.editorialService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[EditorialService::EditorialFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllEditorialRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // EDITORIAL ACTIONS -------------------------------------------------------------
  protected onClearEditorialForm(): void {
    this.editorial.selectedItem.set(null);
    this.editorial.showModal.set(false);
  }

  protected onCreateEditorial(): void {
    this.editorial.selectedItem.set(null);
    this.editorial.showModal.set(true);
  }

  protected onEditEditorial(item: EditorialModel): void {
    this.editorial.selectedItem.set(item);
    this.editorial.showModal.set(true);
  }

  protected onSubmitEditorialForm(form: { id: number, data: SaveEditorialModel }): void {
    const id = form.id;
    const payload: SaveEditorialModel = form.data;

    this.mutation.run(
      id > 0
        ? this.editorialService.update(id, payload)
        : this.editorialService.create(payload),
      { isSaving: this.editorial.isSaving },
      {
        successMsg: id > 0
          ? `Editorial: ${payload.name} modificada correctamente`
          : `Editorial: ${payload.name} creada correctamente`,
        errorMsg: id > 0 ? 'Error al modificar la Editorial' : 'Error al crear la Editorial',
        onSuccess: () => {
          this.onClearEditorialForm();
          this.reload();
        },
      }
    );
  }

  protected async onDeleteEditorial(item: EditorialModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Editorial',
      message: `Estás seguro que deseas eliminar la Editorial (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.editorialService.delete(item.id_editorial),
      { isSaving: this.editorial.isSaving },
      {
        successMsg: `Editorial: ${item.name} eliminada correctamente`,
        errorMsg: 'Error al eliminar la Editorial',
        onSuccess: () => this.reload(),
      }
    );
  }

  // ACTIONS -----------------------------------------------------------------------
  protected navigateBack(): void {
    this.location.back();
  }
}