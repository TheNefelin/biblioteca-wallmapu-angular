import { DatePipe } from '@angular/common';
import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { GenreSelectComponent } from "@features/book-genre/components/genre-select-component/genre-select-component";
import { AuthorSelectComponent } from "@features/book-author/components/author-select-component/author-select-component";
import { SubjectSelectComponent } from "@features/book-subject/components/subject-select-component/subject-select-component";
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { AuthorModel } from '@features/book-author/models/author-model';
import { AuthorSelectedListComponent } from "@features/book-author/components/author-selected-list-component/author-selected-list-component";
import { SubjectSelectedListComponent } from "@features/book-subject/components/subject-selected-list-component/subject-selected-list-component";
import { BookModel, SaveBookModel } from '@features/book/models/book-model';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-book-form-component',
  imports: [
    DatePipe,
    MessageErrorComponent,
    GenreSelectComponent,
    AuthorSelectComponent,
    SubjectSelectComponent,
    LoadingComponent,
    AuthorSelectedListComponent,
    SubjectSelectedListComponent,
    ButtonComponent
  ],
  templateUrl: './book-form-component.html',
})
export class BookFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly actionText = input.required<string>();
  readonly book = input<BookModel | null>(null);
  protected readonly submitForm = output<{ id: number, data: SaveBookModel }>();
  protected readonly navigateToGenre = output<void>();
  protected readonly navigateToAuthor = output<void>();
  protected readonly navigateToSubject = output<void>();

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly AuthorSubjectClearTrigger = signal<number>(0);
  protected readonly formAuthors = linkedSignal<AuthorModel[]>(() => this.book()?.authors ?? []);
  protected readonly formSubjects = linkedSignal<SubjectModel[]>(() => this.book()?.subjects ?? []);
  protected readonly formData = linkedSignal<SaveBookModel>(() => {
    const payload = this.book();

    return { 
      title: payload?.title ?? '',
      summary: payload?.summary ?? '',
      genre_id: payload?.genre.id_genre ?? 0,
      author_ids: payload?.authors.map(e => e.id_author) ?? [],
      subject_ids: payload?.subjects.map(e => e.id_subject) ?? [],
    }
  });

  // FORM INPUTS -------------------------------------------------------------------
  protected updateTitle(value: string, input: HTMLInputElement) {
    this.updateField('title', value, input);
  }

  protected updateSummary(value: string, input: HTMLTextAreaElement) {
    this.updateField('summary', value, input);
  }

  protected updateGenre(item: GenreModel | null) {
    if (!item) return;
    this.formData.update(data => ({ ...data, genre_id: item.id_genre, }));
  }

  private updateField<K extends keyof SaveBookModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    } 

    this.formData.update(data => {
      const updated = { ...data, [key]: sanitized };  
      return updated;
    });

    this.errorMessage.set(null);
  }

  private sanitize(key: keyof SaveBookModel, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;      
      default:
        return value;
    }
  }  

  // FORM ACTIONS ------------------------------------------------------------------
  protected addAuthor(item: AuthorModel | null) {
    if (!item) return;

    this.formAuthors.update(data => {
      const exists = data?.some(e => e.id_author === item.id_author);
      if (exists) return data;

      return [...data, item]
    });

    this.AuthorSubjectClearTrigger.update(e => e + 1);
  }
  
  protected onDeleteAuthor(item: AuthorModel): void {    
    this.formAuthors.update(data => data.filter(e => e.id_author !== item.id_author));
  }

  protected addSubject(item: SubjectModel | null) {
    if (!item) return;

    this.formSubjects.update(data => {
      const exists = data?.some(e => e.id_subject === item.id_subject);
      if (exists) return data;

      return [...data, item]
    });

    this.AuthorSubjectClearTrigger.update(e => e + 1);
  }

  protected onDeleteSubject(item: SubjectModel): void {
    this.formSubjects.update(data => data.filter(e => e.id_subject !== item.id_subject));
  }

  // SUBMIT ------------------------------------------------------------------------
  protected formSubmit(): void {
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) {
      this.errorMessage.set(error);
      return;
    }

    this.submitForm.emit({
      id: this.book()?.id_book ?? 0,
      data: data
    });

    this.errorMessage.set(null)
  }

  private validateFormOnSubmit(data: Partial<SaveBookModel>): string | null {
    const title = data.title?.trim();
    if (!title) return 'El título es requerido';
    if (title.length < 2) return 'El título debe tener al menos 2 caracteres';
    if (title.length > 100) return 'El título no debe superar los 100 caracteres';
  
    const summary = data.summary?.trim();
    if (!summary) return 'El resumen es requerido';
    if (summary.length < 10) return 'El resumen debe tener al menos 10 caracteres';
  
    if (!data.genre_id || data.genre_id === 0) return 'El género es requerido';
  
    return null; // ✅ sin errores
  }
}
