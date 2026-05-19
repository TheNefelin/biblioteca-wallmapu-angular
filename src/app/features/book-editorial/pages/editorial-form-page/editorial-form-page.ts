import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { EditorialFormComponent } from '@features/book-editorial/components/editorial-form-component/editorial-form-component';
import { EditorialListComponent } from '@features/book-editorial/components/editorial-list-component/editorial-list-component';
import { CreateEditorialModel, EditorialModel, UpdateEditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";

@Component({
  selector: 'app-editorial-form-page',
  imports: [
    SectionHeaderComponent,
    EditorialFormComponent,
    EditorialListComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    ModalActionComponent
],
  templateUrl: './editorial-form-page.html',
})
export class EditorialFormPage {
  private location = inject(Location);

  protected readonly selectedEditorial = signal<EditorialModel | null>(null);
  protected readonly selectedEditorialToDelete = signal<EditorialModel | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getEditorialRX,
      this.saveEditorialRX,
      this.deleteEditorialRX,
    ].some(e => e.isLoading())
  );

  private readonly editorialService = inject(EditorialService);
  private readonly saveEditorialPayload = signal<CreateEditorialModel | UpdateEditorialModel | null>(null);
  private readonly deleteEditorialPayload = signal<number | null>(null);
  private readonly getEditorialPayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
    }
  });
  protected readonly computedPaginationGenreList = computed<PaginationResponseModel<EditorialModel[]> | null>(() => this.getEditorialRX.value() ?? null);

  private readonly getEditorialRX = rxResource({
    params: () => this.getEditorialPayload(),
    stream: ({ params }) => {

       return this.editorialService.getAllPagination(params).pipe(
        map((response: { isSuccess: any; message: string | undefined; data: any; }) => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly saveEditorialRX = rxResource({
    params: () => this.saveEditorialPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_editorial' in params && params.id_editorial > 0
        ? this.editorialService.update(params.id_editorial, params)
        : this.editorialService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
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

  private readonly deleteEditorialRX = rxResource({
    params: () => this.deleteEditorialPayload(),
    stream: ({ params: id_subject }) => { 
      if (!id_subject) return of(null);

       return this.editorialService.delete(id_subject).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
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
  
  protected onSelectedGenre(item: EditorialModel): void {
    this.selectedEditorial.set(item);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  protected onFormSubmit(form: EditorialModel): void {
    const payload: CreateEditorialModel | UpdateEditorialModel = form.id_editorial > 0
    ? {
        id_editorial: form.id_editorial,
        name: form.name,
      } as UpdateEditorialModel
    : {
        name: form.name,
      } as CreateEditorialModel;

    this.saveEditorialPayload.set(payload);
  }

  protected onDeleteGenre(item: EditorialModel): void {
    this.onOpenModal();
    this.selectedEditorialToDelete.set(item);
  }


  protected onOpenModal(): void {
    this.isModalOpen.set(true);
  }

  protected onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  protected onConfirmModal(): void {
    if (!this.selectedEditorialToDelete()) return;
    const id_editorial = this.selectedEditorialToDelete()?.id_editorial ?? null

    this.deleteEditorialPayload.set(id_editorial);
  }
  
  protected onClear(): void{
    this.selectedEditorialToDelete.set(null);
    this.selectedEditorial.set(null);
    this.errorMessage.set(null);
  }

  protected onReload(): void {
    this.getEditorialRX.reload();
  }

  protected onNextPage(): void {
    const totalPages = this.computedPaginationGenreList()?.pages ?? 1

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
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
