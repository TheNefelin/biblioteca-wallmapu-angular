import { DatePipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { EditionModel } from '@features/edition/models/edition-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ImagePreviewVM } from '@features/edition/models/vm.image-preview';

@Component({
  selector: 'app-edition-form-components',
  imports: [
    JsonPipe,
    DatePipe,
    NgOptimizedImage,
    LoadingComponent,
    EditorialSelectComponents,
    MessageErrorComponent
],
  templateUrl: './edition-form-components.html',
})
export class EditionFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly editionModel = input<EditionModel | null>(null);
  readonly onFormSubmit = output<EditionModel>();

  protected readonly id_editorial = signal<number | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly imagePreview = signal<ImagePreviewVM>({
    preview: 'images/without_cover.webp',
    isNew: true
  });
  protected readonly formData = signal<Partial<EditionModel>>({
    id_edition: 0,
    edition: '',
    isbn: '',
    publication_year: 0,
    pages: 0
  });

  private readonly updateEffect = effect(() => {
    const editorial = this.editionModel();
    if (editorial) {
      this.formData.set(editorial);
      this.id_editorial.set(editorial.editorial_id)
      this.imagePreview.update(e => ({ 
        ...e, 
        preview: editorial.cover_image,
        isNew: false
      }));
    }
  });
  
  protected updateEdition(value: string, input: HTMLInputElement) {
    this.updateField('edition', value, input);
  }

  protected updateISBN(value: string, input: HTMLInputElement) { 
    this.updateField('isbn', value, input);
  }

  protected updateYear(value: string, input: HTMLInputElement) { 
    this.updateField('publication_year', value, input);
  }

  protected updatePages(value: string, input: HTMLInputElement) { 
    this.updateField('pages', value, input);
  }

  protected updateEditorial(id_editorial: number) {
    this.formData.update(data => ({ ...data, editorial_id: id_editorial }));
  }

  private updateField<K extends keyof EditionModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof EditionModel, value: string): string | null {
    switch (key){
      case 'edition':
        if (value.length > 50) return null;
        return value;
      case 'isbn':
        if (value.length > 20) return null;
        return value;
      case 'publication_year':
        if (!/^[0-9.]*$/.test(value)) return null;  // solo números y puntos
        if (value.length > 4) return null;
        return value;
      case 'pages':
        if (!/^[0-9.]*$/.test(value)) return null;  // solo números y puntos
        if (value.length > 4) return null;
        return value;          
      default:
        return value;
    }
  }

  protected onChangeImages(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.errorMessage.set('Debes seleccionar una imagen');
      return;
    }

    const file = input.files[0];

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('El archivo debe ser una imagen');
      return;
    }

    this.errorMessage.set(null);

    // Generar preview y guardar file
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.update(e => ({
        ...e,
        file: file,
        preview: reader.result as string,
        isNew: true,
      }));
    };

    reader.readAsDataURL(file);
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    //this.onFormSubmit.emit(submitData);
  }

  protected deleteImage(id_edition: number): void {
    console.log(id_edition)
  }
}
