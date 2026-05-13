import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { GenreSelectComponents } from "@features/book-genre/components/genre-select-components/genre-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { AuthorModel } from '@features/book-author/models/author-model';
import { BookFormVM } from '@features/book/models/vm.book-form';
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { AuthorSelectedListComponents } from "@features/book-author/components/author-selected-list-components/author-selected-list-components";
import { SubjectSelectedListComponents } from "@features/book-subject/components/subject-selected-list-components/subject-selected-list-components";

@Component({
  selector: 'app-book-form-component',
  imports: [
    DatePipe,
    MessageErrorComponent,
    GenreSelectComponents,
    AuthorSelectComponents,
    SubjectSelectComponents,
    LoadingComponent,
    ButtonCreateComponent,
    AuthorSelectedListComponents,
    SubjectSelectedListComponents
],
  templateUrl: './book-form-component.html',
})
export class BookFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly actionText = input.required<string>();
  readonly bookFormVM = input<BookFormVM | null>(null);
  readonly onDeleteAuthor = output<AuthorModel>();
  readonly onDeleteSubject = output<SubjectModel>();
  readonly onFormSubmit = output<BookFormVM>();
  readonly onNavigateToGenre = output<void>();
  readonly onNavigateToAuthor = output<void>();
  readonly onNavigateToSubject = output<void>();

  readonly errorMessage = signal<string | null>(null);
  readonly formData = signal<Partial<BookFormVM>>({});

  private readonly updateEffect = effect(() => {
    const book = this.bookFormVM();
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

  protected updateGenre(id_genre: number) {
    this.formData.update(data => ({ ...data, genre_id: id_genre,  }));
  }

  protected addAuthor(item: AuthorModel | null) {
    if (!item) return;
    if (!item.id_author || item.id_author === 0) return;
    
    this.formData.update(data => {
      const exists = data.authors?.some(a => a.id_author === item.id_author);
      if (exists) return data;
    
      return {
        ...data,
        authors: [...data.authors || [], item]
      };
    });
  }

  protected addSubject(item: SubjectModel) {
    if (!item.id_subject || item.id_subject === 0) return;
    
    this.formData.update(data => {
      const exists = data.subjects?.some(a => a.id_subject === item.id_subject);
      if (exists) return data;
    
      return {
        ...data,
        subjects: [...data.subjects || [], item]
      };
    });
  }

  private updateField<K extends keyof BookFormVM>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
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

  private sanitize(key: keyof BookFormVM, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;      
      default:
        return value;
    }
  }  

  protected deleteAuthor(item: AuthorModel): void {    
    this.formData.update(data => {
      return {
        ...data,
        authors: data.authors?.filter(s => s.id_author !== item.id_author) || []
      };
    });
  }

  protected deleteSubject(item: SubjectModel): void {
    this.formData.update(data => {
      return {
        ...data,
        subjects: data.subjects?.filter(s => s.id_subject !== item.id_subject) || []
      };
    });
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const baseData = this.bookFormVM();

    const submitData: BookFormVM = { 
      ...baseData,
      ...data,
    } as BookFormVM

    this.errorMessage.set(null)
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<BookFormVM>): string | null {
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

  protected navigateToGenre(): void {
    this.onNavigateToGenre.emit();
  }

  protected navigateToAuthor(): void {
    this.onNavigateToAuthor.emit();
  }

  protected navigateToSubject(): void {
    this.onNavigateToSubject.emit();
  }
}
