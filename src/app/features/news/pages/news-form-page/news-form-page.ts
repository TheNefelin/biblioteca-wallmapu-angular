import { Component, computed, effect, inject, signal } from '@angular/core';
import { NewsFormComponent } from "@features/news/components/news-form-component/news-form-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NewsFormVM } from '@features/news/models/vm.news-form-model';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, tap } from 'rxjs';
import { NewsService } from '@features/news/services/news-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageListComponent } from "@features/news-gallery/components/image-list-component/image-list-component";
import { ImagePreviewVM } from '@features/news-gallery/models/image-preview.vm';
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { CreateNewsGalleryModel } from '@features/news-gallery/models/create-news-gallery-model';
import { extractErrorMessage } from '@core/utils/error-handler';
import { CreateNewsModel, NewsDetailModel, UpdateNewsModel } from '@features/news/models/news-model';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";

@Component({
  selector: 'app-news-form-page',
  imports: [
    NewsFormComponent,
    SectionHeaderComponent,
    ImageListComponent,
    MessageErrorComponent,
    MessageSuccessComponent,
],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly routeId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('id')) ?? 0)
    ),
    { initialValue: 0 }
  );
  
  protected readonly isEditMode = computed(() => this.getNewsPayload() > 0);
  protected readonly actionText = computed<string>(() => this.isEditMode() ? 'Modificar Noticia' : 'Crear Noticia');
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getNewsRX,
      this.saveNewsRX,
      this.uploadGalleryRX,
      this.deleteGalleryRX,
    ].some(r => r.isLoading())
  );

  protected readonly vmNewsForm = signal<NewsFormVM | null>(null);
  protected readonly imagePreviewList = signal<ImagePreviewVM[]>([]);

  private readonly syncEffect = effect(() => {
    if (this.getNewsRX.isLoading()) return;

    const data = this.computedNewsDetail();

    if (!data) {
      if (this.routeId() === 0 && !this.vmNewsForm()) {
        this.vmNewsForm.set({ id_news: 0, title: '', subtitle: '', body: '' });
        this.imagePreviewList.set([]);
      }
      return;
    }

    if (this.vmNewsForm()?.id_news === data.id_news) return;

    this.vmNewsForm.set({
      id_news: data.id_news,
      title: data.title,
      subtitle: data.subtitle,
      body: data.body,
    });

    this.imagePreviewList.set(
      data.images?.map(e => ({
        id: e.id_news_gallery,
        alt: e.alt,
        preview: e.url,
        isNew: false,
      })) ?? []
    );
  })

  private readonly newsService = inject(NewsService);
  private readonly getNewsPayload = signal<number>(this.routeId());
  private readonly saveNewsPayload = signal<CreateNewsModel | UpdateNewsModel | null>(null);
  private readonly computedNewsDetail = computed<NewsDetailModel | null>(() => this.getNewsRX.value() ?? null);

  private readonly newsGalleryService = inject(NewsGalleryService)
  private readonly uploadGalleryPayload = signal<{
    id_news: number | null;
    createNewsGalleryModel: CreateNewsGalleryModel;
  } | null>(null);
  private readonly deleteGalleryPayload = signal<number | null>(null);

  private readonly getNewsRX = rxResource({
    params: () => this.getNewsPayload(),
    stream: ({ params: id_news }) => {
      if (!id_news) return of(null);

      return this.newsService.getById(id_news).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap((news) => {
          if (!news) this.updateRouteId(0);
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly saveNewsRX = rxResource({
    params: () => this.saveNewsPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      const request$ = 'id_news' in params && params.id_news > 0
        ? this.newsService.update(params.id_news, params)
        : this.newsService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap((news) => {
          if (!news) return;

          this.updateRouteId(news.id_news);

          const newImages = this.imagePreviewList().filter(i => i.isNew);

          if (newImages.length === 0) {
            this.routeGoBack();
            return;
          }

          this.uploadGalleryPayload.set({
            id_news: news.id_news,
            createNewsGalleryModel: {
              files: newImages.map(i => i.file!),
              alts: newImages.map(i => i.alt?.trim() || 'Imagen sin nombre'),
            },
          });
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly uploadGalleryRX = rxResource({
    params: () => this.uploadGalleryPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      if (!params.id_news) return of(null);

      return this.newsGalleryService.create(
        params.id_news,
        params.createNewsGalleryModel.files,
        params.createNewsGalleryModel.alts
      ).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.routeGoBack();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly deleteGalleryRX = rxResource({
    params: () => this.deleteGalleryPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsGalleryService.delete(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.imagePreviewList.update(list =>
            list.filter(i => i.id !== params)
          );
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  protected onFormSubmit(form: NewsFormVM): void {
    const payload: CreateNewsModel | UpdateNewsModel = form.id_news === 0
      ? (form as CreateNewsModel)
      : (form as UpdateNewsModel);

    this.saveNewsPayload.set(payload)
  }

  protected onChangeImagesPreviewVMList(images: ImagePreviewVM[]) {
    this.imagePreviewList.update(list => {
      const combined = [...list, ...images];
  
      if (combined.length > 3) {
        this.errorMessage.set('Solo se pueden agregar 3 Imagnes');
        return list; // no agregamos nada
      }
  
      return combined;
    });
  }

  protected onUpdateImagesPreviewVMList(images: ImagePreviewVM[]) {
    this.imagePreviewList.set(images);
  }

  protected onDeleteImagesPreviewVM(image: ImagePreviewVM) {
    if (image.isNew) {
      this.imagePreviewList.update(list => list.filter(i => i !== image));
      return;
    }

    if (!image.id) return;
    this.deleteGalleryPayload.set(image.id);
  }

  protected routeGoBack() {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.ROOT]);
  }

  private updateRouteId(id: number) {
    this.router.navigate(
      [ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM(id)],
      { replaceUrl: true }
    );
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
