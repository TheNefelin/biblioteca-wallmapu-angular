import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { FormatFormComponent } from '@features/format/components/format-form-component/format-form-component';
import { CreateFormatModel, FormatModel, UpdateFormatModel } from '@features/format/models/format-model';
import { FormatService } from '@features/format/services/format-service';
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
  selector: 'app-format-form-page',
  imports: [
    DatePipe,
    SectionHeaderComponent,
    FormatFormComponent,
    SearchInputComponent,
    LoadingComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './format-form-page.html',
})
export class FormatFormPage extends CrudPage<FormatModel> {
  private location = inject(Location);
  private service = inject(FormatService);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  protected readonly isFormModalOpen = signal<boolean>(false);
  protected readonly selectedFormat = signal<FormatModel | null>(null);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly computedList = computed<FormatModel[]>(() => this.getAllRX.value() ?? []);

  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.service.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[FormatService::FormatFormPage] getAllPagination:', err);
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
  protected onSelectedFormat(item: FormatModel): void {
    this.selectedFormat.set(item);
    this.isFormModalOpen.set(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  protected onClearForm(): void {
    this.selectedFormat.set(null);
    this.isFormModalOpen.set(false);
  }
  
  protected onSubmitForm(form: FormatModel): void {
    const id = form.id_format;
    const payload: CreateFormatModel | UpdateFormatModel = id > 0
      ? { id_format: id, name: form.name }
      : { name: form.name };

    this.mutation.run(
      id > 0
        ? this.service.update(id, payload as UpdateFormatModel)
        : this.service.create(payload as CreateFormatModel),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0
          ? `Formato: ${form.name} modificado correctamente`
          : `Formato: ${form.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Formato' : 'Error al crear el Formato',
        onSuccess: () => {
          this.onClearForm();
          this.reload();
        },
      }
    );
  }

  protected async onDelete(item: FormatModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Formato',
      message: `Estás seguro que deseas eliminar el formato (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.service.delete(item.id_format),
      { isSaving: this.isSaving },
      {
        successMsg: `Formato: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Formato',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected navigateBack(): void {
    this.location.back();
  }
}
