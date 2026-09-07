import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { NewsFormComponent } from "@features/news/components/news-form-component/news-form-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { NewsService } from '@features/news/services/news-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageListComponent } from "@features/news-gallery/components/image-list-component/image-list-component";
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';
import { MutationService } from '@core/services/mutation-service';
import { ToastSuccessService } from '@core/services/toast-success-service';
import { NewsModel, SaveNewsModel } from '@features/news/models/news-model';
import { Preview, SaveNewsGalleryModel } from '@features/news-gallery/models/news-gallery-model';

@Component({
  selector: 'app-news-form-page',
  imports: [
    NewsFormComponent,
    SectionHeaderComponent,
    ImageListComponent,
],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mutation = inject(MutationService);
  private readonly toast = inject(ToastSuccessService);
  private readonly newsService = inject(NewsService);
  private readonly newsGalleryService = inject(NewsGalleryService);

  readonly isSaving = signal(false);

  readonly newsId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => {
        const parsed = Number(params.get('id'));
        return Number.isFinite(parsed) ? parsed : 0;
      })
    ),
    { initialValue: 0 }
  );

  protected readonly isEditMode = computed(() => this.newsId() > 0);
  protected readonly actionText = computed<string>(() => this.isEditMode() ? 'Modificar Noticia' : 'Crear Noticia');

  protected readonly news = {
    data: computed<NewsModel | null>(() => this.getNewsRX.value() ?? null),
    isLoading: computed<boolean>(() => this.getNewsRX.isLoading()),
  }

  protected readonly newsGallery = {
    previewList: linkedSignal<Preview[]>(() => {
      const images = this.news.data()?.images ?? [];

      return images.map(e => ({
        id: e.id_news_gallery,
        url: e.url,
        alt: e.alt,
        file: null,
      }));
    }),
  }

  // Solo las imágenes nuevas (con archivo local) se suben al guardar.
  protected readonly savePayload = computed<SaveNewsGalleryModel[]>(() =>
    this.newsGallery.previewList()
      .filter(i => i.file)
      .map(i => ({ file: i.file!, alt: i.alt }))
  );

  private readonly getNewsRX = rxResource({
    params: () => this.newsId(),
    stream: ({ params: id_news }) => {
      if (!id_news) return of(null);
      return this.newsService.getById(id_news).pipe(
        catchError(() => of(null))
      );
    }
  });

  // Agrega imágenes nuevas provenientes del formulario, respetando el límite de 3.
  protected onAddImages(images: Preview[]): void {
    this.newsGallery.previewList.update(list => {
      if (list.length + images.length > 3) {
        this.toast.show('Solo se pueden agregar hasta 3 imágenes', 'info');
        return list;
      }
      return [...list, ...images];
    });
  }

  // Aplica el alt editado por el image-list a la imagen correspondiente (por url única).
  protected onUpdateAlt(event: { item: Preview, alt: string }): void {
    const normalizedAlt = event.alt.trim() || 'Imagen sin nombre';

    this.newsGallery.previewList.update(list =>
      list.map(i => i.url === event.item.url ? { ...i, alt: normalizedAlt } : i)
    );
  }

  protected onDeleteImage(item: Preview): void {
    if (item.id === 0) {
      this.newsGallery.previewList.update(list => list.filter(i => i.url !== item.url));
      return;
    }

    this.mutation.run(
      this.newsGalleryService.delete(item.id),
      { isSaving: this.isSaving },
      {
        successMsg: 'Imagen eliminada correctamente',
        errorMsg: 'Error al eliminar la imagen',
        onSuccess: () => this.newsGallery.previewList.update(list => list.filter(i => i.id !== item.id)),
      }
    );
  }

  protected onSubmitNewsForm(form: { id: number, data: SaveNewsModel }): void {
    const id = form.id;
    const payload = form.data;

    this.mutation.run(
      id > 0
        ? this.newsService.update(id, payload)
        : this.newsService.create(payload),
      { isSaving: this.isSaving },
      {
        successMsg: 'Noticia guardada correctamente',
        errorMsg: 'Error al guardar la Noticia',
        onSuccess: (news) => {
          if (!news) return;

          const newImages = this.savePayload();
          if (newImages.length === 0) { this.routeGoBack(); return; }
          this.uploadImages(id > 0 ? id : news.id_news, newImages);
        },
      }
    );
  }

  private uploadImages(newsId: number, newImages: SaveNewsGalleryModel[]): void {
    this.mutation.run(
      this.newsGalleryService.create(newsId, newImages),
      { isSaving: this.isSaving },
      {
        successMsg: 'Galería actualizada correctamente',
        errorMsg: 'Error al subir la galería',
        onSuccess: () => this.routeGoBack(),
      }
    );
  }

  protected routeGoBack() {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.ROOT]);
  }
}
