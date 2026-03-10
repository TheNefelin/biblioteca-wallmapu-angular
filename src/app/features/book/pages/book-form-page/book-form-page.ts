import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { BookFormComponent } from '@features/book/components/book-form-component/book-form-component';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { BookFormModel } from '@features/book/models/book-form-model';
import { AuthorModel } from '@features/book-author/models/author-model';
import { BookAuthorStepService } from '@features/book-author-step/services/book-author-step-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { BookSubjectStepService } from '@features/book-subject-step/services/book-subject-step-service';
import { BookService } from '@features/book/services/book-service';
import { EditionListComponents } from "@features/edition/components/edition-list-components/edition-list-components";
import { EditionModel } from '@features/edition/models/edition-model';

@Component({
  selector: 'app-book-form-page',
  imports: [
    SectionHeaderComponent,
    BookFormComponent,
    MessageErrorComponent,
    EditionListComponents
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

  protected readonly authorModelList = signal<AuthorModel[]>([]);
  protected readonly subjectModelList = signal<SubjectModel[]>([]);
  protected readonly editionModelList = signal<EditionModel[]>([]);
  protected readonly bookFormModel = signal<BookFormModel>({
    id_book: 0,
    title: '',
    summary: '',
    created_at: '',
    updated_at: '',
    genre_id: 0,
    authors: [],
    subjects: []
  });

  protected readonly isEditMode = signal<boolean>(false);
  protected readonly headerText = computed<string>(() => this.isEditMode() ? "Modificar Libro" : "Crear Libro");
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => this.bookGetRX.isLoading() || this.bookRX.isLoading() || this.deleteSubjectStepRX.isLoading() || this.deleteAuthorStepRX.isLoading());

  private readonly bookService = inject(BookService);
  private readonly bookIdPayload = signal(this.routeId());

  private readonly bookGetRX = rxResource({
    params: () => this.bookIdPayload(),
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
          
          this.bookFormModel.set({
            id_book: book.id_book,
            title: book.title,
            summary: book.summary,
            created_at: book.created_at,
            updated_at: book.updated_at,
            genre_id: book.genre.id_genre,
            authors: book.authors.map(a => a.id_author),
            subjects: book.subjects.map(s => s.id_subject)
          });
  
          this.authorModelList.set(book.authors);
          this.subjectModelList.set(book.subjects);
          this.editionModelList.set(book.editions);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly bookPayload = signal<BookFormModel | null>(null);

  private readonly bookRX = rxResource({
    params: () => this.bookPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      const request$ = this.isEditMode()
        ? this.bookService.update(params.id_book, params)
        : this.bookService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap((result) => {
          this.bookIdPayload.set(result.id_book);
          this.bookPayload.set(null);
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
          this.authorModelList.update(subjects =>
            subjects.filter(s => s.id_author !== params.id_author)
          );
          this.deleteAuthorStepPayload.set(null);
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
          this.subjectModelList.update(subjects =>
            subjects.filter(s => s.id_subject !== params.id_subject)
          );
        
          this.deleteSubjectStepPayload.set(null);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly updateEffect = effect(() => {
    this.bookFormModel.update(form => ({
      ...form,
      authors: this.authorModelList().map(a => a.id_author),
      subjects: this.subjectModelList().map(s => s.id_subject)
    }));
  });
  
  protected newSelectedGenreId(genre_id: number) {
    this.bookFormModel.update(book => ({
      ...book,
      genre_id: genre_id
    }));
  }

  protected newSelectedAuthor(item: AuthorModel) {
    if (!item) return;

    this.authorModelList.update(list => {
      const exists = list.some(a => a.id_author === item.id_author);
      if (exists) return list;
  
      return [...list, item];
    });
  }

  protected deleteAuthor(item: AuthorModel) {
    this.deleteAuthorStepPayload.set({
      id_book: this.bookFormModel().id_book,
      id_author: item.id_author
    });
  }

  protected newSelectedSubject(item: SubjectModel) {
    if (!item) return;

    this.subjectModelList.update(list => {
      const exists = list.some(a => a.id_subject === item.id_subject);
      if (exists) return list;
  
      return [...list, item];
    });
  }

  protected deleteSubject(item: SubjectModel) {
    this.deleteSubjectStepPayload.set({
      id_book: this.bookFormModel().id_book,
      id_subject: item.id_subject
    });
  }

  protected formChange(data: Partial<BookFormModel>) {
    this.bookFormModel.update(book => ({
      ...book,
      ...data
    }));
  }

  protected formSubmit(item: BookFormModel): void {
    this.bookPayload.set({
      ...item,
      authors: this.authorModelList().map(a => a.id_author),
      subjects: this.subjectModelList().map(s => s.id_subject)
    });
  }

  protected navigateGoBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.ROOT]);
  }

  protected onCreateEdition(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], { 
      state: {
        title:  this.bookFormModel().title,
        id_book: this.bookFormModel().id_book,
        id_edition: 0,
      } 
    }); 
  }

  protected editEdition(item: EditionModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], { 
      state: {
        title:  this.bookFormModel().title,
        id_book: this.bookFormModel().id_book,
        id_edition: item.id_edition,
      } 
    }); 
  }

  protected deleteEdition(item: EditionModel): void {

  }

}
