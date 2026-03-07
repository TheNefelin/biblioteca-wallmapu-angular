import { DatePipe, JsonPipe } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";
import { AuthorListComponents } from "@features/book-author/components/author-list-components/author-list-components";
import { SubjectListComponents } from "@features/book-subject/components/subject-list-components/subject-list-components";
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { BookFormModel } from '@features/book/models/book-form-model';
import { AuthorModel } from '@features/book-author/models/author-model';

@Component({
  selector: 'app-book-form-component',
  imports: [
    DatePipe,
    MessageErrorComponent,
    GenreSelectComponents,
    AuthorSelectComponents,
    SubjectSelectComponents,
    AuthorListComponents,
    SubjectListComponents,
    LoadingComponent
],
  templateUrl: './book-form-component.html',
})
export class BookFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly actionText = input.required<string>();
  readonly bookFormModel = input<BookFormModel | null>(null);
  readonly AuthorModelList = input<AuthorModel[]>([])
  readonly subjectModelList = input<SubjectModel[]>([])
  //------------------------------------------------
  readonly onNewSelectedGenreId = output<number>();
  //------------------------------------------------
  readonly onNewSelectedAuthor = output<AuthorModel>();
  readonly onDeleteAuthor = output<AuthorModel>();
  //------------------------------------------------
  readonly onNewSelectedSubject = output<SubjectModel>();
  readonly onDeleteSubject = output<SubjectModel>();
  //------------------------------------------------
  readonly onFormSubmit = output<BookFormModel>();
  //------------------------------------------------

  readonly errorMessage = signal<string | null>(null);
  readonly formData = signal<Partial<BookFormModel>>({});

  private readonly effect = effect(() => {
    const book = this.bookFormModel();
    if (book) {
      this.formData.set(book);
    }
  });

  protected updateTitle(value: string, input: HTMLInputElement) {
    this.updateField('title', value, input);
  }

  protected updateSummary(value: string, input: HTMLTextAreaElement) {
    this.updateField('summary', value, input);
  }

  private updateField<K extends keyof BookFormModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof BookDetailModel, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;      
      default:
        return value;
    }
  }
  
  protected newSelectedGenreId(genre_id: number) {
    this.onNewSelectedGenreId.emit(genre_id);
  }

  protected newSelectedAuthor(item: AuthorModel) {
    this.onNewSelectedAuthor.emit(item)
  }

  protected deleteAuthor(item: AuthorModel): void {
    this.onDeleteAuthor.emit(item);
  }

  protected newSelectedSubject(item: SubjectModel) {
    this.onNewSelectedSubject.emit(item)
  }

  protected deleteSubject(item: SubjectModel): void {
    this.onDeleteSubject.emit(item);
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: BookFormModel = { 
      ...data,
      id_book: data.id_book!,
      title: data.title!,
      summary: data.summary!,
      created_at: data.created_at!,
      updated_at: data.updated_at!,
      genre_id: data.genre_id!,
      authors: data.authors!,
      subjects: data.subjects!
    }

    this.errorMessage.set(null)
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<BookFormModel>): string | null {
    const title = data.title?.trim();
    if (!title) return 'El título es requerido';
    if (title.length < 2) return 'El título debe tener al menos 2 caracteres';
    if (title.length > 100) return 'El título no debe superar los 100 caracteres';
  
    const summary = data.summary?.trim();
    if (!summary) return 'El resumen es requerido';
    if (summary.length < 10) return 'El resumen debe tener al menos 10 caracteres';
  
    if (!data.genre_id || data.genre_id === 0) return 'El género es requerido';
  
    if (!data.authors?.length) return 'El o los autores son requeridos';
    if (!data.subjects?.length) return 'El o los descriptores son requeridos';
  
    return null; // ✅ sin errores
  }
}
