import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { BookFormComponent } from '@features/book/components/book-form-component/book-form-component';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { BookSubjectStepModel } from '@features/book-subject-step/models/book-subject-step-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { BookFormModel } from '@features/book/models/book-form-model';
import { JsonPipe } from '@angular/common';
import { AuthorModel } from '@features/book-author/models/author-model';
import { BookAuthorStepService } from '@features/book-author-step/services/book-author-step-service';
import { BookAuthorStepModel } from '@features/book-author-step/models/book-author-step-model';
import { BookSubjectStepService } from '@features/book-subject-step/services/book-subject-step-service';

@Component({
  selector: 'app-book-form-page',
  imports: [
    JsonPipe,
    SectionHeaderComponent,
    BookFormComponent,
    MessageErrorComponent
],
  templateUrl: './book-form-page.html',
})
export class BookFormPage {
  private readonly state = history.state as { bookModel: BookDetailModel };
  private readonly router = inject(Router);

  protected readonly authorModelList = signal<AuthorModel[]>(this.state.bookModel.authors ?? []);
  protected readonly subjectModelList = signal<SubjectModel[]>(this.state.bookModel.subjects ?? []);
  protected readonly bookFormModel = signal<BookFormModel>({
    id_book: this.state.bookModel.id_book,
    title: this.state.bookModel.title,
    summary: this.state.bookModel.summary,
    created_at: this.state.bookModel.created_at,
    updated_at: this.state.bookModel.updated_at,
    genre_id: this.state.bookModel.genre.id_genre,
    authors: this.authorModelList().map(s => s.id_author) ?? [],
    subjects: this.subjectModelList().map(s => s.id_subject) ?? []
  });

  protected readonly isEditMode = computed<boolean>(() => !!this.bookFormModel());
  protected readonly headerText = computed<string>(() => this.isEditMode() ? "Modificar lLibro" : "Crear lLibro");
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => this.deleteSubjectStepRX.isLoading() || this.deleteAuthorStepRX.isLoading());

  private readonly authorStepService = inject(BookAuthorStepService);
  private readonly deleteAuthorStepPayload = signal<BookAuthorStepModel | null>(null);

  private readonly deleteAuthorStepRX = rxResource({
    params: () => this.deleteAuthorStepPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.authorStepService.delete(params).pipe(
        map(res => {
          console.log(res)
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        tap(() => {
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

    this.authorModelList.update(e => [
      ...e,
      item
    ]);
  }

  protected deleteAuthor(item: AuthorModel) {
    this.deleteAuthorStepPayload.set({
      id_book: this.bookFormModel().id_book,
      id_author: item.id_author
    });
  }

  protected newSelectedSubject(item: SubjectModel) {
    if (!item) return;

    this.subjectModelList.update(subjects => [
      ...subjects,
      item
    ]);
  }

  protected deleteSubject(item: SubjectModel) {
    this.deleteSubjectStepPayload.set({
      id_book: this.bookFormModel().id_book,
      id_subject: item.id_subject
    });
  }

  protected navigateGoBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.ROOT]);
  }
}
