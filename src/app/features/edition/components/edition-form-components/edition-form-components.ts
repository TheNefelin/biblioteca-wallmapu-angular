import { DatePipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { EditionFormVM } from '@features/edition/models/vm.edition-form-model';

@Component({
  selector: 'app-edition-form-components',
  imports: [
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
  readonly editionFormVM = input<EditionFormVM>();
  readonly onFormSubmit = output<EditionFormVM>();
  readonly onDeleteImage = output<number>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formData = signal<Partial<EditionFormVM>>({});

  private readonly updateEffect = effect(() => {
    const edition = this.editionFormVM();
    if (!edition) return;

    this.formData.set({
      ...edition,
    });
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

  private updateField<K extends keyof EditionFormVM>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof EditionFormVM, value: string): string | number  | null {
    switch (key){
      case 'edition':
        if (value.length > 50) return null;
        return value;
      case 'isbn':
        if (value.length > 20) return null;
        return value;
      case 'publication_year':
        if (!/^[0-9]*$/.test(value)) return null;
        if (value.length > 4) return null;
        return Number(value);
      case 'pages':
        if (!/^[0-9]*$/.test(value)) return null;
        if (value.length > 5) return null;
        return Number(value);      
      default:
        return value;
    }
  }

  protected onChangeImages(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      // Si tampoco existe imagen previa → error
      if (!this.formData()?.cover_image) {
        this.errorMessage.set('Debes seleccionar una imagen');
      }
      // Si ya hay imagen previa → no hacer nada
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
      this.formData.update(e => ({
        ...e,
        file: file,
        cover_image: reader.result as string,
        isNewImg: true,
      }));
    };

    reader.readAsDataURL(file);
  }

  protected formSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.errorMessage.set(null);
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: EditionFormVM = {
      ...this.editionFormVM(),
      ...data
    } as EditionFormVM;

    this.errorMessage.set(null);
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<EditionFormVM>): string | null {
    if (!data.edition?.trim())    return 'La edición es requerido';
    if (data.edition.length < 5)  return 'La edición debe tener al menos 2 caracteres';
    if (data.edition.length > 50) return 'La edición no debe superar los 50 caracteres';
    if (!data.isbn?.trim())       return 'El ISBN es requerido';
    if (data.isbn.length < 5)     return 'El ISBN debe tener al menos 5 caracteres';
    if (data.isbn.length > 20)    return 'El ISBN no debe superar los 50 caracteres';
    if (!data.publication_year)   return 'El año es requerido';
    if (data.publication_year < 1800 || data.publication_year > new Date().getFullYear()) return 'El año debe ser valido';
    if (!data.pages)              return 'Las paginas son requerido';
    if (data.pages < 24 || data.pages > 10000) return 'La cantidad de paginas debe ser valida';
    if (!data.editorial_id)       return 'La editorial es requerida';
    if (data.editorial_id == 0)   return 'La editorial es requerida';
    if (!data.cover_image)        return 'Debes seleccionar una imagen';
    return null;
  }

  protected deleteImage(id_edition: number): void {
    this.onDeleteImage.emit(id_edition)
  }
}
