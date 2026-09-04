import { DatePipe } from '@angular/common';
import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { GenreSelectComponent } from "@features/book-genre/components/genre-select-component/genre-select-component";
import { AuthorSelectComponent } from "@features/book-author/components/author-select-component/author-select-component";
import { SubjectSelectComponent } from "@features/book-subject/components/subject-select-component/subject-select-component";
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { AuthorModel } from '@features/book-author/models/author-model';
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { AuthorSelectedListComponent } from "@features/book-author/components/author-selected-list-component/author-selected-list-component";
import { SubjectSelectedListComponent } from "@features/book-subject/components/subject-selected-list-component/subject-selected-list-component";
import { BookModel, SaveBookModel } from '@features/book/models/book-model';
import { GenreModel } from '@features/book-genre/models/genre-model';

@Component({
  selector: 'app-book-form-component',
  imports: [
    DatePipe,
    MessageErrorComponent,
    GenreSelectComponent,
    AuthorSelectComponent,
    SubjectSelectComponent,
    LoadingComponent,
    ButtonCreateComponent,
    AuthorSelectedListComponent,
    SubjectSelectedListComponent
],
  templateUrl: './book-form-component.html',
})
export class BookFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly actionText = input.required<string>();
  readonly book = input<BookModel | null>(null);
  protected readonly deleteAuthor = output<AuthorModel>();
  protected readonly deleteSubject = output<SubjectModel>();
  protected readonly submitForm = output<SaveBookModel>();
  protected readonly navigateToGenre = output<void>();
  protected readonly navigateToAuthor = output<void>();
  protected readonly navigateToSubject = output<void>();

  protected readonly errorMessage = signal<string | null>(null);
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

    this.formData.update(data => {
      const exists = data?.author_ids.some(id => id === item.id_author);
      if (exists) return data;
    
      return {
        ...data,
        authors: [...data?.author_ids || [], item.id_author]
      };
    });
  }
  
  protected onDeleteAuthor(item: AuthorModel): void {    
    this.formData.update(data => {
      return {
        ...data,
        authors: data.author_ids?.filter(id => id !== item.id_author) || []
      };
    });

    this.deleteAuthor.emit(item);
  }

  protected addSubject(item: SubjectModel | null) {
    if (!item) return;
    
    this.formData.update(data => {
      const exists = data?.subject_ids?.some(id => id === item.id_subject);
      if (exists) return data;
    
      return {
        ...data,
        subject_ids: [...data?.subject_ids || [], item.id_subject]
      };
    });
  }

  protected onDeleteSubject(item: SubjectModel): void {
    this.formData.update(data => {
      return {
        ...data,
        subjects: data.subject_ids?.filter(id => id !== item.id_subject) || []
      };
    });

    this.deleteSubject.emit(item);
  }

  // SUBMIT ------------------------------------------------------------------------
  protected formSubmit(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: SaveBookModel = { 
      ...data,
    }

    this.errorMessage.set(null)
    this.submitForm.emit(submitData);
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
