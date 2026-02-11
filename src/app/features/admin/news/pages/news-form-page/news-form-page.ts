import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal,  } from '@angular/core';
import { NewsModel } from '@core/models/news-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES } from '@shared/constants/routes';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsService } from '@core/services/news-service';

@Component({
  selector: 'app-news-form-page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    MessageErrorComponent
],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  private readonly initialUrl: NewsModel | null = history.state.url;
  private readonly newsService = inject(NewsService);

  readonly ROUTES = ROUTES;
  readonly news = signal<NewsModel | null>(this.initialUrl);
  readonly isEditMode = computed(() => this.news() !== null);
  readonly actionText = computed(() => this.news() ? "Modificar Noticia" : "Crear Noticia");
  readonly imageError = signal<string | null>(null);
  readonly selectedImages = signal<File[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly formData = signal<Partial<NewsModel>>({
    title: this.initialUrl?.title ?? '',
    subtitle: this.initialUrl?.subtitle ?? '',
    body: this.initialUrl?.body ?? '',
  });

  protected updateTitle(value: string): void {
    this.formData.update((data) => ({ ...data, title: value }));
    this.errorMessage.set(null);
  }

  protected updateSubtitle(value: string): void {
    this.formData.update((data) => ({ ...data, subtitle: value }));
    this.errorMessage.set(null);
  }

  protected updateBody(value: string): void {
    this.formData.update((data) => ({ ...data, body: value }));
    this.errorMessage.set(null);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage.set(null);

    const data = this.formData();
    const title = (data.title ?? '').trim();
    const subtitle = (data.subtitle ?? '').trim();
    const body = (data.body ?? '').trim();
    
    if (!title) {
      this.errorMessage.set('El título es obligatorio');
      return;
    }

    if (!subtitle) {
      this.errorMessage.set('El subtítulo es obligatorio');
      return;
    }

    if (!body) {
      this.errorMessage.set('La descripción es obligatorio');
      return;
    }


  }

  protected onChangeImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    // requerido
    if (files.length === 0) {
      this.imageError.set('Debes seleccionar al menos una imagen');
      input.value = '';
      return;
    }

    // máximo 3
    if (files.length > 3) {
      this.imageError.set('Máximo 3 imágenes permitidas');
      input.value = '';
      return;
    }

    // solo imágenes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.imageError.set('Solo se permiten imágenes');
        input.value = '';
        return;
      }
    }

    this.imageError.set(null);
    this.selectedImages.set(files);
  }

  protected createPreview(file: File): string {
    return URL.createObjectURL(file);
  }
}
