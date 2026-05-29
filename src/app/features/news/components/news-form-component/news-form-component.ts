import { Component, effect, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { HttpErrorResponse } from '@angular/common/http';
import { ImagePreviewVM } from '@features/news-gallery/models/image-preview.vm';
import { NewsFormVM } from '@features/news/models/vm.news-form-model';

@Component({
  selector: 'app-news-form-component',
  imports: [
    MessageErrorComponent,
    LoadingComponent
],
  templateUrl: './news-form-component.html',
})
export class NewsFormComponent {
  // ─── IO
  readonly isLoading = input<boolean>(false);
  readonly actionText = input.required<string>()
  readonly newsFormVM = input<NewsFormVM | null>(null);
  readonly onFormSubmit = output<NewsFormVM>();
  readonly onChangeImagesPreviewVMList = output<ImagePreviewVM[]>();

  // ─── ESTADO
  readonly errorMessage = signal<string | null>(null);

  // ─── FORM DATA
  readonly formData = signal<Partial<NewsFormVM>>({});

  private readonly syncFormEffect = effect(() => {
    const vm = this.newsFormVM();
    if (vm)  this.formData.set(vm);
  });

  protected updateTitle(value: string, input: HTMLInputElement) { 
    this.updateField('title', value, input); 
  }
  protected updateSubtitle(value: string, input: HTMLInputElement) { 
    this.updateField('subtitle', value, input); 
  }
  protected updateBody(value: string, input: HTMLTextAreaElement) {
    this.updateField('body', value, input); 
  }

  private updateField<K extends keyof NewsFormVM>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: value }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof NewsFormVM, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;
      case 'subtitle':
        if (value.length > 256) return null;
        return value;     
      default:
        return value;
    }
  }

  // ─── SUBMIT
  protected formSubmit(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const completeData = this.newsFormVM();
    
    if (!completeData) {
      this.errorMessage.set('No se encontró la noticia original');
      return;
    }

    const submitData: NewsFormVM = { 
      ...completeData,
      ...data 
    }

    this.errorMessage.set(null)
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<NewsFormVM>): string | null {
    if (!data.title?.trim())        return 'El titulo es requerido';
    if (data.title.length < 2)      return 'El titulo debe tener al menos 2 caracteres';
    if (data.title.length > 100)    return 'El titulo no debe superar los 100 caracteres';
  
    if (!data.subtitle?.trim())     return 'El subtitulo es requerido';
    if (data.subtitle.length < 2)   return 'El subtitulo debe tener al menos 2 caracteres';
    if (data.subtitle.length > 256) return 'El titulo no debe superar los 256 caracteres';
  
    if (!data.body?.trim())         return 'La descripcion es requerido';
    if (data.body.length < 2)       return 'El descripcion debe tener al menos 2 caracteres';
    
    return null; // ✅ sin errores
  }

  // ─── IMAGE HANDLING
  protected onChangeImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (!files.length) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.handleError(null, 'Solo se permiten imágenes');
        input.value = '';
        return;
      }
    }

    const newImagePreviewVMList: ImagePreviewVM[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      alt: ''
    }));
    
    this.onChangeImagesPreviewVMList.emit(newImagePreviewVMList);
  }

  private handleError(e: HttpErrorResponse | null, message: string) {
    this.errorMessage.set(message);
  }
}
