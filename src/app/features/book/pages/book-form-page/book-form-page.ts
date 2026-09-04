import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { BookFormComponent } from '@features/book/components/book-form-component/book-form-component';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { AuthorModel } from '@features/book-author/models/author-model';
import { BookAuthorStepService } from '@features/book-author-step/services/book-author-step-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { BookSubjectStepService } from '@features/book-subject-step/services/book-subject-step-service';
import { BookService } from '@features/book/services/book-service';
import { EditionListComponents } from "@features/edition/components/edition-list-components/edition-list-components";
import { EditionService } from '@features/edition/services/edition-service';
import { BookModel, CreateBookModel, UpdateBookModel } from '@features/book/models/book-model';
import { BookFormVM } from '@features/book/models/vm.book-form';
import { EditionDetailModel } from '@features/edition/models/edition-model';
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';

@Component({
  selector: 'app-book-form-page',
  imports: [
    SectionHeaderComponent,
    BookFormComponent,
    EditionListComponents,
    ButtonCreateComponent
  ],
  templateUrl: './book-form-page.html',
})
export class BookFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

  readonly routeId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('id_book')) || 0)
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

  protected readonly isEditMode = computed<boolean>(() => this.getBookPayload() > 0);
  protected readonly headerText = computed<string>(() => this.isEditMode() ? "Modificar Libro" : "Crear Libro");
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionRX,
    ].some(r => r.isLoading())
  );
  protected readonly isSaving = signal<boolean>(false);

  private readonly bookService = inject(BookService);
  protected readonly bookDetailComputed = computed<BookModel | null>(() => this.getBookRX.value() ?? null);
  private readonly getBookPayload = signal(this.routeId());

  private readonly authorStepService = inject(BookAuthorStepService);
  private readonly subjectStepService = inject(BookSubjectStepService);
  private readonly editionService = inject(EditionService);

  protected readonly computedEditionList = computed<EditionDetailModel[]>(() => this.getEditionRX.value() ?? []);

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
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

  private readonly getEditionRX = rxResource({
    params: () => this.getBookPayload(),
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

  protected deleteAuthor(item: AuthorModel) {
    if (!this.isEditMode()) return;

    const payload: BookAuthorStepModel = {
      id_book: this.bookFormVM().id_book,
      id_author: item.id_author
    };

    this.mutation.run(
      this.authorStepService.delete(payload),
      { isSaving: this.isSaving },
      {
        successMsg: 'Autor eliminado correctamente',
        errorMsg: 'Error al eliminar el Autor',
        onSuccess: () => this.getBookRX.reload(),
      }
    );
  }

  protected deleteSubject(item: SubjectModel) {
    if (!this.isEditMode()) return;

    const payload: BookSubjectStepModel = {
      id_book: this.bookFormVM().id_book,
      id_subject: item.id_subject
    };

    this.mutation.run(
      this.subjectStepService.delete(payload),
      { isSaving: this.isSaving },
      {
        successMsg: 'Descriptor eliminado correctamente',
        errorMsg: 'Error al eliminar el Descriptor',
        onSuccess: () => this.getBookRX.reload(),
      }
    );
  }

  protected formSubmit(form: BookFormVM): void {
    const basePayload = {
      ...form,
      author_ids: form.authors.map(e => e.id_author),
      subject_ids: form.subjects.map(e => e.id_subject),
    }

    const id = basePayload.id_book;

    const payload: CreateBookModel | UpdateBookModel = id === 0
      ? (basePayload as CreateBookModel)
      : (basePayload as UpdateBookModel);

    this.mutation.run(
      id === 0
        ? this.bookService.create(payload as CreateBookModel)
        : this.bookService.update(id, payload as UpdateBookModel),
      { isSaving: this.isSaving },
      {
        successMsg: this.isEditMode() ? 'Libro modificado correctamente' : 'Libro creado correctamente',
        errorMsg: this.isEditMode() ? 'Error al modificar el Libro' : 'Error al crear el Libro',
        onSuccess: () => this.getBookRX.reload(),
      }
    );
  }

  protected async onDeleteEdition(item: EditionDetailModel): Promise<void> {
    if (!item) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Edición',
      message: `Estás seguro que deseas eliminar la edición?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.editionService.delete(item.id_edition),
      { isSaving: this.isSaving },
      {
        successMsg: 'Edición eliminada correctamente',
        errorMsg: 'Error al eliminar la Edición',
        onSuccess: () => this.getBookRX.reload(),
      }
    );
  }

  protected navigateGoBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.ROOT]);
  }

  protected navigateToGenre(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.GENRE.ROOT]);
  }

  protected navigateToAuthor(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.AUTHOR.ROOT]);
  }

  protected navigateToSubject(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.SUBJECT.ROOT]);
  }

  protected onCreateEdition(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(this.bookFormVM().id_book, 0)]);
  }

  protected editEdition(item: EditionDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(this.bookFormVM().id_book, item.id_edition)]);
  }
}