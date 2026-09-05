import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { BookFormComponent } from '@features/book/components/book-form-component/book-form-component';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { BookService } from '@features/book/services/book-service';
import { EditionListComponents } from "@features/edition/components/edition-list-components/edition-list-components";
import { EditionService } from '@features/edition/services/edition-service';
import { BookModel, SaveBookModel } from '@features/book/models/book-model';
import { EditionDetailModel } from '@features/edition/models/edition-model';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';

@Component({
  selector: 'app-book-form-page',
  imports: [
    SectionHeaderComponent,
    BookFormComponent,
    EditionListComponents,
  ],
  templateUrl: './book-form-page.html',
})
export class BookFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

  readonly bookId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('id_book')) || 0)
    ),
    { initialValue: 0 }
  );

  // SERVICES ----------------------------------------------------------------------
  protected readonly isEditMode = computed<boolean>(() => this.bookId() > 0);
  protected readonly heading = computed<string>(() => this.isEditMode() ? "Modificar Libro" : "Crear Libro");
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionByBookRX,
    ].some(r => r.isLoading())
  );

  private readonly bookService = inject(BookService);
  protected readonly book = {
    isSaving: signal<boolean>(false),
    data: computed<BookModel | null>(() => this.getBookRX.value() ?? null),
  }

  private readonly editionService = inject(EditionService);
  protected readonly edition = {
    isSaving: signal<boolean>(false),
    dataList: computed<EditionDetailModel[]>(() => this.getEditionByBookRX.value() ?? []),
  }
  
  // FETCHS ------------------------------------------------------------------------
  private readonly getBookRX = rxResource({
    params: () => this.bookId(),
    stream: ({ params: idBook }) => {
      if (!idBook) return of(null);

      return this.bookService.getById(idBook).pipe(
        map(response => response),
        catchError(err => {
          console.error('[BookService::BookFormPage] getBook:', err);
          return of(null);
        })
      );
    }
  });

  private readonly getEditionByBookRX = rxResource({
    params: () => this.bookId(),
    stream: ({ params: idBook }) => {
      if (!idBook) return of(null);

      return this.editionService.getAllDetailByBook(idBook).pipe(
        map(response => response),
        catchError(err => {
          console.error('[EditionService::BookFormPage] getEdition:', err);
          return of(null);
        })
      );
    }
  });

  // BOOK ACTIONS ------------------------------------------------------------------  
  protected onSubmitBookForm(form: { id: number, data: SaveBookModel }): void {
    const id = form.id;
    const payload: SaveBookModel = form.data;

    this.mutation.run(
      id === 0
        ? this.bookService.create(payload)
        : this.bookService.update(id, payload),
      { isSaving: this.book.isSaving },
      {
        successMsg: this.isEditMode() ? 'Libro modificado correctamente' : 'Libro creado correctamente',
        errorMsg: this.isEditMode() ? 'Error al modificar el Libro' : 'Error al crear el Libro',
        onSuccess: (result) => this.onBookSaved(result),
      }
    );
  }

  private onBookSaved(result: BookModel | null | undefined): void {
    if (!this.isEditMode() && result) {
      this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(result.id_book)]);
    } else {
      this.getBookRX.reload();
    }
  }

  // EDITION ACTIONS ----------------------------------------------------------------
  protected async onDeleteEdition(item: EditionDetailModel): Promise<void> {
    if (!item) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Edición',
      message: `Estás seguro que deseas eliminar la edición?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.editionService.delete(item.id_edition),
      { isSaving: this.edition.isSaving },
      {
        successMsg: 'Edición eliminada correctamente',
        errorMsg: 'Error al eliminar la Edición',
        onSuccess: () => this.getEditionByBookRX.reload(),
      }
    );
  }

  // NAVIGATION ----------------------------------------------------------------------
  protected onNavigateGoBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.ROOT]);
  }

  protected onNavigateToGenre(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.GENRE.ROOT]);
  }

  protected onNavigateToAuthor(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.AUTHOR.ROOT]);
  }

  protected onNavigateToSubject(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.SUBJECT.ROOT]);
  }

  protected onCreateEdition(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(this.bookId(), 0)]);
  }

  protected onEditEdition(item: EditionDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(this.bookId(), item.id_edition)]);
  }
}