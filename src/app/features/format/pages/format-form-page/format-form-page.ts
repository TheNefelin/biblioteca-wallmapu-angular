import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { FormatFormComponent } from '@features/format/components/format-form-component/format-form-component';
import { FormatListComponent } from '@features/format/components/format-list-component/format-list-component';
import { FormatModel, SaveFormatModel } from '@features/format/models/format-model';
import { FormatService } from '@features/format/services/format-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';

@Component({
  selector: 'app-format-form-page',
  imports: [
    SectionHeaderComponent,
    FormatFormComponent,
    FormatListComponent,
  ],
  templateUrl: './format-form-page.html',
})
export class FormatFormPage extends CrudPage<FormatModel> {
  private location = inject(Location);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  // SERVICES ----------------------------------------------------------------------
  private formatService = inject(FormatService);
  protected readonly format = {
    dataList: computed<FormatModel[]>(() => this.getAllFormatRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllFormatRX.isLoading()),
    isSaving: signal<boolean>(false),
    showModal: signal<boolean>(false),
    selectedItem: signal<FormatModel | null>(null),
  }

  // FETCHS ------------------------------------------------------------------------
  private readonly getAllFormatRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.formatService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[FormatService::FormatFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllFormatRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // FORMAT ACTIONS -----------------------------------------------------------------
  protected onClearFormatForm(): void {
    this.format.selectedItem.set(null);
    this.format.showModal.set(false);
  }

  protected onCreateFormat(): void {
    this.format.selectedItem.set(null);
    this.format.showModal.set(true);
  }

  protected onEditFormat(item: FormatModel): void {
    this.format.selectedItem.set(item);
    this.format.showModal.set(true);
  }

  protected onSubmitFormatForm(form: { id: number, data: SaveFormatModel }): void {
    const id = form.id;
    const payload: SaveFormatModel = form.data;

    this.mutation.run(
      id > 0
        ? this.formatService.update(id, payload)
        : this.formatService.create(payload),
      { isSaving: this.format.isSaving },
      {
        successMsg: id > 0
          ? `Formato: ${payload.name} modificado correctamente`
          : `Formato: ${payload.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Formato' : 'Error al crear el Formato',
        onSuccess: () => {
          this.onClearFormatForm();
          this.reload();
        },
      }
    );
  }

  protected async onDeleteFormat(item: FormatModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Formato',
      message: `Estás seguro que deseas eliminar el formato (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.formatService.delete(item.id_format),
      { isSaving: this.format.isSaving },
      {
        successMsg: `Formato: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Formato',
        onSuccess: () => this.reload(),
      }
    );
  }

  // ACTIONS -----------------------------------------------------------------------
  protected navigateBack(): void {
    this.location.back();
  }
}