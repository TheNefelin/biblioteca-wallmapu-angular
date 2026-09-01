import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CreateSubjectModel, SubjectModel, UpdateSubjectModel } from '@features/book-subject/models/subject-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { SubjectService } from '@features/book-subject/services/subject-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { SubjectListComponents } from "@features/book-subject/components/subject-list-components/subject-list-components";
import { SubjectFormComponents } from "@features/book-subject/components/subject-form-components/subject-form-components";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-subject-form-page',
  imports: [SectionHeaderComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    SubjectListComponents,
    SubjectFormComponents,
    ModalActionComponent,
  ],
  templateUrl: './subject-form-page.html',
})
export class SubjectFormPage {
  private location = inject(Location);
  
  protected readonly selectedSubject = signal<SubjectModel | null>(null);
  protected readonly selectedSubjectToDelete = signal<SubjectModel | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getSubjectRX,
      this.saveSubjectRX,
      this.deleteSubjectRX,
    ].some(e => e.isLoading())
  );

  private readonly subjectService = inject(SubjectService);
  private readonly saveSubjectPayload = signal<CreateSubjectModel | UpdateSubjectModel | null>(null);
  private readonly deleteSubjectPayload = signal<number | null>(null);
  private readonly getSubjectPayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
    }
  });
  protected readonly computedPaginationSubjectList = computed<PaginationResponseModel<SubjectModel[]> | null>(() => this.getSubjectRX.value() ?? null);

  private readonly getSubjectRX = rxResource({
    params: () => this.getSubjectPayload(),
    stream: ({ params }) => {

      return this.subjectService.getAllPagination(params).pipe(
        map(response => response),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly saveSubjectRX = rxResource({
    params: () => this.saveSubjectPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_subject' in params && params.id_subject > 0
        ? this.subjectService.update(params.id_subject, params)
        : this.subjectService.create(params);

      return request$.pipe(
        map(response => {
          this.successMessage.set('Descriptor guardado correctamente');
          return response;
        }),
        tap(() => {
          this.onClear();
          this.onReload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly deleteSubjectRX = rxResource({
    params: () => this.deleteSubjectPayload(),
    stream: ({ params: id_subject }) => { 
      if (!id_subject) return of(null);

      return this.subjectService.delete(id_subject).pipe(
        map(response => {
          this.successMessage.set('Descriptor eliminado correctamente');
          return response;
        }),
        tap(() => {
          this.onClear();
          this.onReload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        }),
        finalize(() => {
          this.onCloseModal();
        }),
      );
    },
  });

  protected onSearchFilter(searchText: string): void {
    this.search.set(searchText);
  }
  
  protected onSelectedSubject(item: SubjectModel): void {
    this.selectedSubject.set(item);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  protected onFormSubmit(form: SubjectModel): void {
    const payload: CreateSubjectModel | UpdateSubjectModel = form.id_subject > 0
    ? {
        id_subject: form.id_subject,
        name: form.name,
      } as UpdateSubjectModel
    : {
        name: form.name,
      } as CreateSubjectModel;

    this.saveSubjectPayload.set(payload);
  }

  protected onDeleteSubject(item: SubjectModel): void {
    this.onOpenModal();
    this.selectedSubjectToDelete.set(item);
  }

  protected onOpenModal(): void {
    this.isModalOpen.set(true);
  }

  protected onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  protected onConfirmModal(): void {
    if (!this.selectedSubjectToDelete()) return;
    const id_author = this.selectedSubjectToDelete()?.id_subject ?? null

    this.deleteSubjectPayload.set(id_author);
  }
  
  protected onClear(): void{
    this.selectedSubjectToDelete.set(null);
    this.selectedSubject.set(null);
    this.errorMessage.set(null);
  }

  protected onReload(): void {
    this.getSubjectRX.reload();
  }

  protected onNextPage(): void {
    const totalPages = this.computedPaginationSubjectList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  protected onPrevPage(): void {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  protected navigateBack(): void {
    this.location.back();
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
