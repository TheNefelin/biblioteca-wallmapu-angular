import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { catchError, map, of, tap } from 'rxjs';
import { NewsListComponent } from "@features/news/components/news-list-component/news-list-component";
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-news-list-page',
  imports: [
    NewsListComponent,
    ModalDeleteComponent,
    SectionHeaderComponent,
    PaginationComponent,
    MessageErrorComponent,
    ButtonRefreshComponent,
    ButtonCreateComponent
],
  templateUrl: './news-list-page.html',
})
export class NewsListPage {
  private router = inject(Router);
  private readonly newsService = inject(NewsService)
  private readonly newsGalleryService = inject(NewsGalleryService)

  // ─── ESTADOS
  readonly errorMessage = signal<string | null>(null);
  readonly selectedNewsWithImagesModel = signal<NewsWithImagesModel | null>(null);
  readonly openDeleteModal = signal(false);
  readonly currentPage = signal(1);
  private readonly items = signal(10);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);
  readonly isLoading = computed(() => 
    [
      this.getNewsRX,
      this.deleteRX,
      this.deleteAllGalleryRX,
    ].some(e => e.isLoading())
  );

  readonly newsWithImagesList = computed<NewsWithImagesModel[] | []>(() => {
    const data = this.getNewsRX.value();
    if (!data) return [];
    return data
  });

  private readonly deleteAllGalleryByIdNewsPayload = signal<number | null>(null);
  private readonly deleteNewsByIdPayload = signal<number | null>(null);

  private readonly params = computed<PaginationRequestModel>(() => ({
    page: this.currentPage(),
    limit: this.items(),
    search: this.search(),
  }));  
  
  private readonly getNewsRX = rxResource({
    params: () => this.params(),
    stream: ({ params }) => {    
      return this.newsService.getAll(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.data.pages);
          return response.data.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly deleteAllGalleryRX = rxResource({
    params: () => this.deleteAllGalleryByIdNewsPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsGalleryService.delete_all(params).pipe(
        map(r => {
          if (!r.isSuccess) throw new Error(r.message);
          return r.data;
        }),
        tap(() => {
          this.deleteNewsByIdPayload.set(this.deleteAllGalleryByIdNewsPayload());
          this.deleteAllGalleryByIdNewsPayload.set(null);
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });
  
  private readonly deleteRX = rxResource({
    params: () => this.deleteNewsByIdPayload(),
    stream: ({ params: payloadId }) => {
      if (payloadId === null) return of(null);

      return this.newsService.delete(payloadId).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        tap(() => {
          this.refreshList()
          this.closeDeleteModal();
          this.deleteNewsByIdPayload.set(null);
          this.selectedNewsWithImagesModel.set(null);
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });
 
  refreshList() {
    this.getNewsRX.reload();
  }

  onCreate(){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM(0)]);
  }

  onEdit(newsWithImagesModel: NewsWithImagesModel){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM(newsWithImagesModel.id_news)]);
  }

  onDelete(newsWithImagesModel: NewsWithImagesModel) {
    if (!newsWithImagesModel) return;
    this.selectedNewsWithImagesModel.set(newsWithImagesModel)
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    const selectedNewsWithImagesModel = this.selectedNewsWithImagesModel();
    if (!selectedNewsWithImagesModel) return;
    this.deleteAllGalleryByIdNewsPayload.set(selectedNewsWithImagesModel.id_news);
  } 

  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }

  searchText(text: string) {
    this.search.set(text);
    this.currentPage.set(1); 
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
  }
}
