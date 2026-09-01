import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { AuthorModel, CreateAuthorModel, UpdateAuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { AuthorListComponents } from "@features/book-author/components/author-list-components/author-list-components";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { AuthorFormComponents } from "@features/book-author/components/author-form-components/author-form-components";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-author-form-page',
  imports: [
    AuthorListComponents,
    SectionHeaderComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    AuthorFormComponents,
    ModalActionComponent,
  ],
  templateUrl: './author-form-page.html',
})
export class AuthorFormPage {
  private location = inject(Location);

  protected readonly selectedAuthor = signal<AuthorModel | null>(null);
  protected readonly selectedAuthorToDelete = signal<AuthorModel | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');

  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getAuthorRX,
      this.saveAuthorRX,
      this.deleteAuthorRX,
    ].some(e => e.isLoading())
  );

  private readonly authorService = inject(AuthorService);
  private readonly saveAuthorPayload = signal<CreateAuthorModel | UpdateAuthorModel | null>(null);
  private readonly deleteAuthorPayload = signal<number | null>(null);
  private readonly getAuthorPayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
    }
  });
  protected readonly computedPaginationAuthorList = computed<PaginationResponseModel<AuthorModel[]> | null>(() => this.getAuthorRX.value() ?? null);

  private readonly getAuthorRX = rxResource({
    params: () => this.getAuthorPayload(),
    stream: ({ params }) => {

      return this.authorService.getAllPagination(params).pipe(
        map(response => response),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });
  
  private readonly saveAuthorRX = rxResource({
    params: () => this.saveAuthorPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_author' in params && params.id_author > 0
        ? this.authorService.update(params.id_author, params)
        : this.authorService.create(params);

      return request$.pipe(
        map(response => {
          this.successMessage.set('Guardado correctamente');
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

  private readonly deleteAuthorRX = rxResource({
    params: () => this.deleteAuthorPayload(),
    stream: ({ params: id_author }) => { 
      if (!id_author) return of(null);

      return this.authorService.delete(id_author).pipe(
        map(response => {
          this.successMessage.set('Eliminado correctamente');
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
  
  protected onSelectedAuthor(item: AuthorModel): void {
    this.selectedAuthor.set(item);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  protected onFormSubmit(form: AuthorModel): void {
    const payload: CreateAuthorModel | UpdateAuthorModel = form.id_author > 0
    ? {
        id_author: form.id_author,
        name: form.name,
      } as UpdateAuthorModel
    : {
        name: form.name,
      } as CreateAuthorModel;

    this.saveAuthorPayload.set(payload);
  }

  protected onDeleteAuthor(item: AuthorModel): void {
    this.onOpenModal();
    this.selectedAuthorToDelete.set(item);
  }

  protected onOpenModal(): void {
    this.isModalOpen.set(true);
  }

  protected onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  protected onConfirmModal(): void {
    if (!this.selectedAuthorToDelete()) return;
    const id_author = this.selectedAuthorToDelete()?.id_author ?? null

    this.deleteAuthorPayload.set(id_author);
  }

  protected onClear(): void{
    this.selectedAuthorToDelete.set(null);
    this.selectedAuthor.set(null);
    this.errorMessage.set(null);
  }

  protected onReload(): void {
    this.getAuthorRX.reload();
  }

  protected onNextPage(): void {
    const totalPages = this.computedPaginationAuthorList()?.pages ?? 1

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
