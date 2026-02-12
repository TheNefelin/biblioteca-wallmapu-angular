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

  readonly imageList = signal<ImageItem[]>(
    this.initialUrl?.images?.map(img => ({
      id: img.id_news_gallery,
      alt: img.alt,
      preview: img.url,
      existing: true
    })) ?? []
  );

  // Modal delete
  readonly modalDeleteOpen = signal(false);
  readonly modalDeleteLoading = signal(false);
  readonly modalDeleteItem = signal<ImageItem | null>(null);

  // Form
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

  /* ------------------- Submit Form ------------------- */
  protected onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { title, subtitle, body } = this.formData();
    const trimmed = { title: title?.trim(), subtitle: subtitle?.trim(), body: body?.trim() };

    for (const field of [
      { value: trimmed.title, message: 'El título es obligatorio' },
      { value: trimmed.subtitle, message: 'El subtítulo es obligatorio' },
      { value: trimmed.body, message: 'La descripción es obligatoria' }
    ]) {
      if (!field.value) {
        this.handleError(null, field.message);
        return;
      }
    }

    const payload: FormNewsModel = {
      id_news: this.isEditMode() ? this.news()!.id_news : 0,
      title: trimmed.title!,
      subtitle: trimmed.subtitle!,
      body: trimmed.body!
    };    

    if (this.isEditMode()) {
      this.updateNews(payload);
    } else {
      this.createNews(payload);
    }
  }

  private updateNews(payload: FormNewsModel) {
    this.newsService.update(payload).subscribe({
      next: () => this.uploadNewImages(payload.id_news),
      error: (e: HttpErrorResponse) => this.handleError(e, 'Error al modificar noticia')
    });
  }

  private createNews(payload: FormNewsModel) {
    this.newsService.create(payload).subscribe({
      next: res => this.uploadNewImages(res.result.id_news),
      error: (e: HttpErrorResponse) => this.handleError(e, 'Error al crear noticia')
    });
  }

  /** Subir solo imágenes nuevas, tanto en creación como edición */
  private uploadNewImages(newsId: number) {
    const newImages = this.imageList().filter(img => !img.existing && img.file);
    if (!newImages.length) return this.navigateBack();

    const files = newImages.map(img => img.file!);
    const alts = newImages.map(img => img.alt?.trim() || "Imagen sin nombre");

    this.newsGalleryService.create(newsId, files, alts).subscribe({
      next: () => this.navigateBack(),
      error: (e: HttpErrorResponse) => this.handleError(e, 'Error al subir imágenes')
    });
  }

  private navigateBack() {
    this.isLoading.set(false);
    this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS]);
  }

  private handleError(e: HttpErrorResponse | null, fallback: string) {
    this.isLoading.set(false);
    this.errorMessage.set(e?.message ?? fallback);
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

  protected createPreview(file: File) {
    return URL.createObjectURL(file);
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
      this.newsGalleryService.delete(item.id).subscribe({
        next: () => this.removeImageFromList(item),
        error: (e: HttpErrorResponse) => this.handleError(e, 'Error al eliminar imagen')
      });
    } else {
      this.removeImageFromList(item);
    }
  }

  private removeImageFromList(item: ImageItem) {
    if (!item.existing && item.file) URL.revokeObjectURL(item.preview); // liberar memoria
    this.imageList.update(list => list.filter(i => i !== item));
    this.modalDeleteLoading.set(false);
    this.modalDeleteOpen.set(false);
  }

  protected updateImageAlt(item: ImageItem, alt: string) {
    this.imageList.update(list =>
      list.map(i => i === item ? { ...i, alt: alt.trim() || 'Imagen sin nombre' } : i)
    );
  }  
}
