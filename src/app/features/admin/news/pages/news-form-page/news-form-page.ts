import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal,  } from '@angular/core';
import { FormNewsModel, NewsWithImagesModel } from '@core/models/news-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES } from '@shared/constants/routes';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsService } from '@core/services/news-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { NewsGalleryService } from '@core/services/news-gallery-service';

@Component({
  selector: 'app-news-form-page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    MessageErrorComponent,
    LoadingComponent
],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  private readonly initialUrl: NewsWithImagesModel | null = history.state.url;
  private readonly newsService = inject(NewsService);
  private readonly newsGalleryService = inject(NewsGalleryService);
  private router = inject(Router);
  
  readonly ROUTES = ROUTES;
  readonly news = signal<NewsWithImagesModel | null>(this.initialUrl);
  readonly isEditMode = computed(() => this.news()?.id_news);
  readonly actionText = computed(() => this.isEditMode() ? "Modificar Noticia" : "Crear Noticia");
  readonly selectedImages = signal<{ file: File; preview: string }[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly formData = signal<Partial<NewsWithImagesModel>>({
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
    
    const requiredFields = [
      { value: title, message: 'El título es obligatorio' },
      { value: subtitle, message: 'El subtítulo es obligatorio' },
      { value: body, message: 'La descripción es obligatoria' }
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        this.errorMessage.set(field.message);
        return;
      }
    }

    const isEdit = this.isEditMode();

    const payload: FormNewsModel = {
      id_news: isEdit ? this.news()!.id_news : 0,
      title: title,
      subtitle: subtitle,
      body: body
    }

    //const request = isEdit
    //  ? this.newsService.update(payload)
    //  : this.newsService.create(payload);

    //this.isLoading.set(true);

    //request.subscribe({
    //  next: () => {
    //    this.isLoading.set(false);
    //    this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS]);
    //  },
    //  error: (e: HttpErrorResponse) => {
    //    this.isLoading.set(false);
    //    this.errorMessage.set(e?.message ?? 'Error inesperado')
    //  },
    //});

    if (isEdit) {
      // Lógica de edición existente
      this.newsService.update(payload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS]);
        },
        error: (e: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set(e?.message ?? 'Error inesperado');
        },
      });
    } else {
      // CREAR NUEVA NOTICIA
      this.newsService.create(payload).subscribe({
        next: (apiResponse) => {
          const newsId = apiResponse.result.id_news;
  
          console.log(newsId)

          // Solo si hay imágenes seleccionadas
          const images = this.selectedImages().map(img => img.file);
          const alts = this.selectedImages().map((_, i) => `Imagen ${i + 1}`);
  
          console.log(images)
          console.log(alts)

          if (images.length > 0) {
            this.newsGalleryService.create(newsId, images, alts).subscribe({
              next: () => {
                this.isLoading.set(false);
                this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS]);
              },
              error: (e: HttpErrorResponse) => {
                this.isLoading.set(false);
                this.errorMessage.set(e?.message ?? 'Error al subir imágenes');
              }
            });
          } else {
            this.isLoading.set(false);
            this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS]);
          }
        },
        error: (e: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set(e?.message ?? 'Error al crear noticia');
        }
      });
    }
  }

  protected onChangeImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    // requerido
    if (files.length === 0) {
      this.errorMessage.set('Debes seleccionar al menos una imagen');
      input.value = '';
      return;
    }

    // minimo 1
    if (files.length < 1) {
      this.errorMessage.set('Minimo 1 imagen permitido');
      input.value = '';
      return;
    }

    // máximo 3
    if (files.length > 3) {
      this.errorMessage.set('Máximo 3 imágenes permitidas');
      input.value = '';
      return;
    }

    // solo imágenes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Solo se permiten imágenes');
        input.value = '';
        return;
      }
    }
  
    const filesWithPreview = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    this.errorMessage.set(null);
    this.selectedImages.set(filesWithPreview);
  }

  protected createPreview(file: File): string {
    return URL.createObjectURL(file);
  }
}
