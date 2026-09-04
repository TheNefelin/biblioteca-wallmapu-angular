import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { SubjectFormComponent } from '@features/book-subject/components/subject-form-component/subject-form-component';
import { SubjectListComponent } from '@features/book-subject/components/subject-list-component/subject-list-component';
import { SaveSubjectModel, SubjectModel } from '@features/book-subject/models/subject-model';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';

@Component({
  selector: 'app-subject-form-page',
  imports: [
    SectionHeaderComponent,
    SubjectFormComponent,
    SubjectListComponent,
  ],
  templateUrl: './subject-form-page.html',
})
export class SubjectFormPage extends CrudPage<SubjectModel> {
  private location = inject(Location);
  private mutation = inject(MutationService);
  private confirmService = inject(ModalConfirmService);

  // SERVICES ----------------------------------------------------------------------
  private subjectService = inject(SubjectService);
  protected readonly subject = {
    dataList: computed<SubjectModel[]>(() => this.getAllSubjectRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllSubjectRX.isLoading()),
    isSaving: signal<boolean>(false),
    showModal: signal<boolean>(false),
    selectedItem: signal<SubjectModel | null>(null),
  }

  // FETCHS ------------------------------------------------------------------------
  private readonly getAllSubjectRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.subjectService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[SubjectService::SubjectFormPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllSubjectRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // SUBJECT ACTIONS -----------------------------------------------------------------
  protected onClearSubjectForm(): void {
    this.subject.selectedItem.set(null);
    this.subject.showModal.set(false);
  }

  protected onCreateSubject(): void {
    this.subject.selectedItem.set(null);
    this.subject.showModal.set(true);
  }

  protected onEditSubject(item: SubjectModel): void {
    this.subject.selectedItem.set(item);
    this.subject.showModal.set(true);
  }

  protected onSubmitSubjectForm(form: { id: number, data: SaveSubjectModel }): void {
    const id = form.id;
    const payload: SaveSubjectModel = form.data;

    this.mutation.run(
      id > 0
        ? this.subjectService.update(id, payload)
        : this.subjectService.create(payload),
      { isSaving: this.subject.isSaving },
      {
        successMsg: id > 0
          ? `Descriptor: ${payload.name} modificado correctamente`
          : `Descriptor: ${payload.name} creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar el Descriptor' : 'Error al crear el Descriptor',
        onSuccess: () => {
          this.onClearSubjectForm();
          this.reload();
        },
      }
    );
  }

  protected async onDeleteSubject(item: SubjectModel): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Descriptor',
      message: `Estás seguro que deseas eliminar el Descriptor (${item.name})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.subjectService.delete(item.id_subject),
      { isSaving: this.subject.isSaving },
      {
        successMsg: `Descriptor: ${item.name} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Descriptor',
        onSuccess: () => this.reload(),
      }
    );
  }

  // ACTIONS -----------------------------------------------------------------------
  protected navigateBack(): void {
    this.location.back();
  }
}