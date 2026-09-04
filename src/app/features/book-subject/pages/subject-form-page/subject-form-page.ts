import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { SubjectFormComponents } from '@features/book-subject/components/subject-form-components/subject-form-components';
import { CreateSubjectModel, SubjectModel, UpdateSubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
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
  selector: 'app-subject-form-page',
  imports: [
    DatePipe,
    SectionHeaderComponent,
    SubjectFormComponents,
    SearchInputComponent,
    LoadingComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './subject-form-page.html',
})
export class SubjectFormPage extends CrudPage<SubjectModel> {
  private location = inject(Location);
  private service = inject(SubjectService);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  protected readonly isFormModalOpen = signal<boolean>(false);
  protected readonly selectedSubject = signal<SubjectModel | null>(null);
  protected readonly isSaving = signal<boolean>(false);
  protected readonly computedList = computed<SubjectModel[]>(() => this.getAllRX.value() ?? []);

  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.service.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[SubjectService::SubjectFormPage] getAllPagination:', err);
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
  protected onSelectedSubject(item: SubjectModel): void {
    this.selectedSubject.set(item);
    this.isFormModalOpen.set(true);
  }

  protected onClearForm(): void {
    this.selectedSubject.set(null);
    this.isFormModalOpen.set(false);
  }

  protected onSubmitForm(form: SubjectModel): void {
    const id = form.id_subject;
    const payload: CreateSubjectModel | UpdateSubjectModel = id > 0
      ? { id_subject: id, name: form.name }
      : { name: form.name };

    this.mutation.run(
      id > 0
        ? this.service.update(id, payload as UpdateSubjectModel)
        : this.service.create(payload as CreateSubjectModel),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0
          ? `Descriptor: ${form.name} modificado correctamente`
          : `Descriptor: ${form.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Descriptor' : 'Error al crear el Descriptor',
        onSuccess: () => {
          this.onClearForm();
          this.reload();
        },
      }
    );
  }

  protected async onDelete(item: SubjectModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Descriptor',
      message: `Estás seguro que deseas eliminar el Descriptor (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.service.delete(item.id_subject),
      { isSaving: this.isSaving },
      {
        successMsg: `Descriptor: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Descriptor',
        onSuccess: () => this.reload(),
      }
    );
  }

  protected navigateBack(): void {
    this.location.back();
  }
}