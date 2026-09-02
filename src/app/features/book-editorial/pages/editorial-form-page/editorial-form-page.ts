import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { EditorialFormComponent } from '@features/book-editorial/components/editorial-form-component/editorial-form-component';
import { CreateEditorialModel, EditorialModel, UpdateEditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
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
  selector: 'app-editorial-form-page',
  imports: [
    DatePipe,
    SectionHeaderComponent,
    EditorialFormComponent,
    SearchInputComponent,
    LoadingComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './editorial-form-page.html',
})
export class EditorialFormPage extends CrudPage<EditorialModel> {
  private location = inject(Location);
  private service = inject(EditorialService);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  protected readonly isFormModalOpen = signal<boolean>(false);
  protected readonly selectedEditorial = signal<EditorialModel | null>(null);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly computedList = computed<EditorialModel[]>(() => this.getAllRX.value() ?? []);

  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.service.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[EditorialService::EditorialFormPage] getAllPagination:', err);
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
  protected onSelectedEditorial(item: EditorialModel): void {
    this.selectedEditorial.set(item);
    this.isFormModalOpen.set(true);
  }

  protected onClearForm(): void {
    this.selectedEditorial.set(null);
    this.isFormModalOpen.set(false);
  }

  protected onSubmitForm(form: EditorialModel): void {
    const id = form.id_editorial;
    const payload: CreateEditorialModel | UpdateEditorialModel = id > 0
      ? { id_editorial: id, name: form.name }
      : { name: form.name };

    this.mutation.run(
      id > 0
        ? this.service.update(id, payload as UpdateEditorialModel)
        : this.service.create(payload as CreateEditorialModel),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0
          ? `Editorial: ${form.name} modificada correctamente`
          : `Editorial: ${form.name} creada correctamente`,
        errorMsg: id > 0 ? 'Error al modificar la Editorial' : 'Error al crear la Editorial',
        onSuccess: () => {
          this.onClearForm();
          this.reload();
        },
      }
    );
  }

  protected async onDelete(item: EditorialModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Editorial',
      message: `Estás seguro que deseas eliminar la Editorial (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.service.delete(item.id_editorial),
      { isSaving: this.isSaving },
      {
        successMsg: `Editorial: ${item.name} eliminada correctamente`,
        errorMsg: 'Error al eliminar la Editorial',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected navigateBack(): void {
    this.location.back();
  }
}