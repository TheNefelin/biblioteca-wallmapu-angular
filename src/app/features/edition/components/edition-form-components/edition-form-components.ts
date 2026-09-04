import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { EditorialSelectComponent } from "@features/book-editorial/components/editorial-select-component/editorial-select-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { FormatSelectComponent } from "@features/format/components/format-select-component/format-select-component";
import { FormatSelectedListComponent } from "@features/format/components/format-selected-list-component/format-selected-list-component";
import { FormatModel } from '@features/format/models/format-model';
import { FormatService } from '@features/format/services/format-service';
import { EditionModel, SaveEditionModel } from '@features/edition/models/edition-model';

@Component({
  selector: 'app-edition-form-components',
  imports: [
    FormsModule,
    DatePipe,
    NgOptimizedImage,
    LoadingComponent,
    EditorialSelectComponent,
    MessageErrorComponent,
    ButtonComponent,
    FormatSelectComponent,
    FormatSelectedListComponent
],
  templateUrl: './edition-form-components.html',
})
export class EditionFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly editionModel = input<EditionModel | null>();
  protected readonly formSubmit = output<{ id: number, data: SaveEditionModel, img: File | null }>();
  protected readonly deleteImage = output<number>();
  protected readonly navigateToEditorial = output<void>();
  protected readonly navigateToFormat = output<void>();

  protected readonly formatClearTrigger = signal<number>(0);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly formatService = inject(FormatService);

  // lista de formatos para resolver el id seleccionado en el objeto completo
  private readonly allFormatsRX = rxResource({
    stream: () => this.formatService.getAll().pipe(
      map((res) => res),
      catchError(() => of([])),
    ),
  });

  protected readonly formFile = signal<File | null>(null)
  protected readonly formFormat = linkedSignal<FormatModel[]>(() => this.editionModel()?.formats ?? []);
  protected readonly formData = linkedSignal<SaveEditionModel>(() => {
    const data = this.editionModel();

    return {
      edition: data?.edition ?? '',
      isbn: data?.isbn ?? '',
      publication_year: data?.publication_year ?? 2026,
      pages: data?.pages ?? 0,
      cover_image: data?.cover_image ?? null,
      book_id: data?.book_id ?? 0,
      editorial_id: data?.editorial_id ?? 0,
      format_ids: [],
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

  protected addFormat(id: number): void {
    if (!id) return;
    const item = this.allFormatsRX.value()?.find(f => f.id_format === id);
    if (!item) return;

    this.formFormat.update(data => {
      const exists = data?.some(e => e.id_format === item.id_format);
      if (exists) return data;

      return [...data, item]
    });

    this.formatClearTrigger.update(e => e + 1);
  }

  protected deleteFormat(item: FormatModel): void {
    this.formFormat.update(data => data.filter(e => e.id_format !== item.id_format));
  }

  private updateField<K extends keyof SaveEditionModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof SaveEditionModel, value: string): string | number  | null {
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
      this.formFile.set(file);
      this.formData.update(e => ({
        ...e,
        cover_image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  protected onSubmit(): void {
    this.errorMessage.set(null);
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: SaveEditionModel = {
      ...data,
      format_ids: this.formFormat().map(e => e.id_format) ?? [],
    } as SaveEditionModel;

    this.errorMessage.set(null);
    
    this.formSubmit.emit({
      id: this.editionModel()?.id_edition ?? 0,
      data: submitData,
      img: this.formFile(),
    });
  }

  private validateFormOnSubmit(data: Partial<SaveEditionModel>): string | null {
    if (data.edition && data.edition.length > 50) return 'La edición no debe superar los 50 caracteres';
    if (data.isbn && data.isbn.length > 20) return 'El ISBN no debe superar los 20 caracteres';
    if (!data.publication_year) return 'El año es requerido';
    if (data.publication_year < 1800 || data.publication_year > new Date().getFullYear()) return 'El año debe ser valido';
    if (!data.pages) return 'Las paginas son requerido';
    if (data.pages < 24 || data.pages > 10000) return 'La cantidad de paginas debe ser valida';
    if (!data.editorial_id) return 'La editorial es requerida';
    if (data.editorial_id == 0) return 'La editorial es requerida';
    if (!data.cover_image) return 'Debes seleccionar una imagen';
    return null;
  }

  protected onNavigateToEditorial(): void {
    this.navigateToEditorial.emit();
  }

  protected onNavigateToFormat(): void {
    this.navigateToFormat.emit();
  }

  protected onDeleteImage(id_edition: number): void {
    if (this.editionModel()?.cover_image) {
      this.deleteImage.emit(id_edition)
    }

    this.formFile.set(null);
    this.formData.update(e => ({
      ...e,
      cover_image: null,
    }));
  }
}
