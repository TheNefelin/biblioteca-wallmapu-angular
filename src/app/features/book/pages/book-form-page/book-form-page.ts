import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { BookFormComponent } from '@features/book/components/book-form-component/book-form-component';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { AuthorModel } from '@features/book-author/models/author-model';
import { BookAuthorStepService } from '@features/book-author-step/services/book-author-step-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { BookSubjectStepService } from '@features/book-subject-step/services/book-subject-step-service';
import { BookService } from '@features/book/services/book-service';
import { EditionListComponents } from "@features/edition/components/edition-list-components/edition-list-components";
import { EditionService } from '@features/edition/services/edition-service';
import { CreateBookModel, UpdateBookModel } from '@features/book/models/book-model';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { BookFormVM } from '@features/book/models/vm.book-form';
import { EditionDetailModel } from '@features/edition/models/edition-detail-model';
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";

@Component({
  selector: 'app-book-form-page',
  imports: [
    SectionHeaderComponent,
    BookFormComponent,
    MessageErrorComponent,
    EditionListComponents,
    ModalDeleteComponent
],
  templateUrl: './book-form-page.html',
})
export class BookFormPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly routeId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('id')) || 0)
    ),
    { initialValue: 0 }
  );

  protected readonly bookFormVM = computed<BookFormVM>(() => {
    const book = this.bookDetailComputed();

    return {
      id_book: book?.id_book ?? this.routeId(),
      title: book?.title ?? '',
      summary: book?.summary ?? '',
      genre_id: book?.genre.id_genre ?? 0,
      authors: book?.authors ?? [],
      subjects: book?.subjects ?? [],
      created_at: book?.created_at ?? '',
      updated_at: book?.updated_at ?? ''
    }
  });

  protected readonly isEditMode = signal<boolean>(this.routeId() > 0);
  protected readonly headerText = computed<string>(() => this.isEditMode() ? "Modificar Libro" : "Crear Libro");
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getBookRX,
      this.addBookRX,
      this.deleteSubjectStepRX,
      this.deleteAuthorStepRX,
      this.editionRX,
    ].some(r => r.isLoading())
  );

  private readonly bookService = inject(BookService);
  protected readonly bookDetailComputed = computed<BookDetailModel | null>(() => this.getBookRX.value() ?? null);
  private readonly getBookPayload = signal(this.routeId());

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: idBook }) => {
      if (!idBook) {
        this.isEditMode.set(false);
        return of(null);
      }

      return this.bookService.getById(idBook).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(book => {
          if (!book) {
            this.isEditMode.set(false);
            return;
          }

          this.isEditMode.set(true);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly addBookPayload = signal<CreateBookModel | UpdateBookModel | null>(null);

  private readonly addBookRX = rxResource({
    params: () => this.addBookPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      const request$ = 'id_book' in params && params.id_book > 0
        ? this.bookService.update(params.id_book, params)
        : this.bookService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap((res) => {
          this.getBookRX.reload();
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly authorStepService = inject(BookAuthorStepService);
  private readonly deleteAuthorStepPayload = signal<BookAuthorStepModel | null>(null);

  private readonly deleteAuthorStepRX = rxResource({
    params: () => this.deleteAuthorStepPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.authorStepService.delete(params).pipe(
        map(res => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        tap((res) => {
          this.getBookRX.reload();
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly subjectStepService = inject(BookSubjectStepService);
  private readonly deleteSubjectStepPayload = signal<BookSubjectStepModel | null>(null);

  private readonly deleteSubjectStepRX = rxResource({
    params: () => this.deleteSubjectStepPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.subjectStepService.delete(params).pipe(
        map(res => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        tap(() => {
          this.getBookRX.reload();
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly editionService = inject(EditionService);
  private readonly deleteEditionPayload = signal<number | null>(null);

  private readonly editionRX = rxResource({
    params: () => this.deleteEditionPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);

      const request$ = this.editionService;

      return request$.delete(id_edition).pipe(
        map(res => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        tap(() => {
          this.getBookRX.reload();
          this.selectedEditionToDelete.set(null);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  protected deleteAuthor(item: AuthorModel) {
    this.deleteAuthorStepPayload.set({
      id_book: this.bookFormVM().id_book,
      id_author: item.id_author
    });
  }

  protected deleteSubject(item: SubjectModel) {
    this.deleteSubjectStepPayload.set({
      id_book: this.bookFormVM().id_book,
      id_subject: item.id_subject
    });
  }

  protected formSubmit(form: BookFormVM): void {
    this.errorMessage.set(null);
    
    const basePayload = {
      ...form,
      author_ids: form.authors.map(e => e.id_author),
      subject_ids: form.subjects.map(e => e.id_subject),
    }

    const payload: CreateBookModel | UpdateBookModel =
    basePayload.id_book === 0
      ? (basePayload as CreateBookModel)
      : (basePayload as UpdateBookModel);

    this.addBookPayload.set(payload);
  }

  protected navigateGoBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.ROOT]);
  }

  protected onCreateEdition(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], {
      state: {
        id_book: this.bookFormVM().id_book,
        id_edition: 0,
      }
    }); 
  }

  protected editEdition(item: EditionDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], {
      state: {
        book_title: this.bookFormVM().title,
        id_book: this.bookFormVM().id_book,
        id_edition: item.id_edition,
      }
    }); 
  }

  // onDelete --------------------------------------------------------
  protected readonly openDeleteModal = signal<boolean>(false);
  readonly selectedEditionToDelete = signal<EditionDetailModel | null>(null);
  
  protected deleteEdition(item: EditionDetailModel): void {
    if (!item) return;
    this.selectedEditionToDelete.set(item);
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    const selectedBookToDelete = this.selectedEditionToDelete();
    if (!selectedBookToDelete) return;
    this.deleteEditionPayload.set(selectedBookToDelete.id_edition);
    this.openDeleteModal.set(false);
  } 

  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }
  // -----------------------------------------------------------------
}
