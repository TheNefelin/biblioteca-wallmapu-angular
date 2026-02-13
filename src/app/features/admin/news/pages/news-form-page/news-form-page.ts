import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormNewsModel, NewsWithImagesModel } from '@core/models/news-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES } from '@shared/constants/routes';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsService } from '@core/services/news-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { NewsGalleryService } from '@core/services/news-gallery-service';
import { ImageItem } from '@features/admin/news/models/image-item';
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { finalize, of, switchMap, throwError } from 'rxjs';
import { ApiResponseModel } from '@core/models/api-response-model';

@Component({
  selector: 'app-news-form-page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    MessageErrorComponent,
    LoadingComponent,
    ModalDeleteComponent
  ],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  private readonly initialUrl: NewsWithImagesModel | null = history.state.url;

  private readonly newsService = inject(NewsService);
  private readonly newsGalleryService = inject(NewsGalleryService);
  private readonly router = inject(Router);

  readonly ROUTES = ROUTES;
  readonly news = signal<NewsWithImagesModel | null>(this.initialUrl);
  readonly isEditMode = computed(() => !!this.news()?.id_news);
  readonly actionText = computed(() => this.isEditMode() ? 'Modificar Noticia' : 'Crear Noticia');
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly imageList = signal<ImageItem[]>(this.initialUrl?.images?.map(img => ({
    id: img.id_news_gallery,
    alt: img.alt,
    preview: img.url,
    existing: true
  })) ?? []);

  // Modal delete
  readonly modalDeleteOpen = signal(false);
  readonly modalDeleteLoading = signal(false);
  readonly modalDeleteItem = signal<ImageItem | null>(null);

  // Form data
  readonly formData = signal<Partial<NewsWithImagesModel>>({
    title: this.initialUrl?.title ?? '',
    subtitle: this.initialUrl?.subtitle ?? '',
    body: this.initialUrl?.body ?? ''
  });

  /* ------------------- Form Updates ------------------- */
  protected updateTitle(value: string) { this.updateField('title', value); }
  protected updateSubtitle(value: string) { this.updateField('subtitle', value); }
  protected updateBody(value: string) { this.updateField('body', value); }

  private updateField<K extends keyof NewsWithImagesModel>(key: K, value: string) {
    this.formData.update(data => ({ ...data, [key]: value }));
    this.errorMessage.set(null);
  }

  /* ------------------- Submit ------------------- */
  protected onSubmit(event: Event) {
    event.preventDefault();

    const { title, subtitle, body } = this.formData();
    const trimmed = {
      title: title?.trim(),
      subtitle: subtitle?.trim(),
      body: body?.trim()
    };

    // Validaciones obligatorias
    if (!trimmed.title) { return this.handleError(null, 'El título es obligatorio'); }
    if (!trimmed.subtitle) { return this.handleError(null, 'El subtítulo es obligatorio'); }
    if (!trimmed.body) { return this.handleError(null, 'La descripción es obligatoria'); }

    // Validaciones de longitud según BD
    if (trimmed.title.length > 45) { return this.handleError(null, 'El título no puede superar 45 caracteres'); }
    if (trimmed.subtitle.length > 45) { return this.handleError(null, 'El subtítulo no puede superar 45 caracteres'); }

    const payload: FormNewsModel = {
      id_news: this.isEditMode() ? this.news()!.id_news : 0,
      title: trimmed.title!,
      subtitle: trimmed.subtitle!,
      body: trimmed.body!
    };

    this.saveNews(payload);
  }

/* ------------------- Save (Create / Update) ------------------- */
private saveNews(payload: FormNewsModel) {
  this.isLoading.set(true);
  this.errorMessage.set(null);

  const request$ = this.isEditMode()
    ? this.newsService.update(payload)
    : this.newsService.create(payload);

  request$
    .pipe(
      switchMap((res: ApiResponseModel<any>) => {
        if (!res.isSuccess) {
          return throwError(() => new Error(res.message || 'Error al guardar noticia'));
        }

        const newsId = this.isEditMode() ? payload.id_news : res.result.id_news;

        // Subir imágenes solo si hay nuevas
        const newImages = this.imageList().filter(img => !img.existing && img.file);
        if (!newImages.length) return of(null);

        const files = newImages.map(img => img.file!);
        const alts = newImages.map(img => img.alt?.trim() || 'Imagen sin nombre');

        return this.newsGalleryService.create(newsId, files, alts).pipe(
          switchMap((resImages: ApiResponseModel<any>) => {
            if (!resImages.isSuccess) {
              return throwError(() => new Error(resImages.message || 'Error al subir imágenes'));
            }
            return of(resImages.result);
          })
        );
      }),
      finalize(() => this.isLoading.set(false)) // siempre se desactiva el loading
    )
    .subscribe({
      next: () => this.navigateBack(),
      error: (err: HttpErrorResponse | Error) => {
        if (err instanceof HttpErrorResponse) {
          this.handleError(err, err.message);
        } else {
          this.handleError(null, err.message); // pasamos null al error HTTP, pero el mensaje se mantiene
        }
      }
    });
  }

  /* ------------------- Upload Images ------------------- */
  private uploadNewImages(newsId: number) {
    const newImages = this.imageList().filter(img => !img.existing && img.file);

    if (!newImages.length) return of(null);

    const files = newImages.map(img => img.file!);
    const alts = newImages.map(img => img.alt?.trim() || 'Imagen sin nombre');

    return this.newsGalleryService.create(newsId, files, alts).pipe(
      switchMap((res: ApiResponseModel<any>) => {
        if (!res.isSuccess) {
          return throwError(() => new Error(res.message || 'Error al subir imágenes'));
        }
        return of(res.result);
      })
    );
  }

  /* ------------------- Navigation & Errors ------------------- */
  private navigateBack() {
    this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS]);
  }

  /* ------------------- Manejo de errores ------------------- */
  private handleError(e: HttpErrorResponse | null, message: string) {
    this.errorMessage.set(message);
    this.isLoading.set(false); // <--- clave para que loading no quede pegado
  }

  /* ------------------- Image Handling ------------------- */
  protected onChangeImages(event: Event) {
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

    if (this.imageList().length + files.length > 3) {
      this.handleError(null, 'Máximo 3 imágenes permitidas');
      input.value = '';
      return;
    }

    const newImages: ImageItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      existing: false,
      alt: ''
    }));

    this.imageList.update(list => [...list, ...newImages]);
    input.value = '';
  }

  protected confirmDeleteImage(item: ImageItem) {
    this.modalDeleteItem.set(item);
    this.modalDeleteOpen.set(true);
  }

  protected executeDeleteImage() {
    const item = this.modalDeleteItem();
    if (!item) return;

    this.modalDeleteLoading.set(true);

    if (item.existing && item.id) {
      this.newsGalleryService.delete(item.id)
        .pipe(finalize(() => {
          this.modalDeleteLoading.set(false);
          this.modalDeleteOpen.set(false);
        }))
        .subscribe({
          next: () => this.removeImageFromList(item),
          error: (e: HttpErrorResponse) =>
            this.handleError(e, 'Error al eliminar imagen')
        });
    } else {
      this.removeImageFromList(item);
      this.modalDeleteLoading.set(false);
      this.modalDeleteOpen.set(false);
    }
  }

  private removeImageFromList(item: ImageItem) {
    if (!item.existing && item.file) URL.revokeObjectURL(item.preview);
    this.imageList.update(list => list.filter(i => i !== item));
  }

  protected updateImageAlt(item: ImageItem, alt: string) {
    this.imageList.update(list =>
      list.map(i => i === item ? { ...i, alt: alt.trim() || 'Imagen sin nombre' } : i)
    );
  }
}