import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { catchError, map, of, switchMap } from 'rxjs';
import { NewsListComponent } from "@features/news/components/news-list-component/news-list-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';

@Component({
  selector: 'app-news-list-page',
  imports: [
    NewsListComponent,
    SectionHeaderComponent,
    PaginationComponent,
    ButtonComponent
],
  templateUrl: './news-list-page.html',
})
export class NewsListPage {
  private router = inject(Router);
  private readonly newsService = inject(NewsService)
  private readonly newsGalleryService = inject(NewsGalleryService)
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

  // ─── ESTADOS
  readonly currentPage = signal(1);
  private readonly items = signal(10);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);
  readonly isSaving = signal(false);
  readonly isLoading = computed(() =>
    [
      this.getNewsRX,
    ].some(e => e.isLoading())
  );

  readonly newsWithImagesList = computed<NewsWithImagesModel[] | []>(() => {
    const data = this.getNewsRX.value();
    if (!data) return [];
    return data
  });

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
          this.totalPages.set(response.pages);
          return response.data;
        }),
        catchError(err => {
          console.error('[NewsService::NewsListPage] getAll:', err);
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

  protected async onDelete(newsWithImagesModel: NewsWithImagesModel): Promise<void> {
    if (!newsWithImagesModel) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Noticia',
      message: `Estás seguro que deseas eliminar la noticia "${newsWithImagesModel.title}"?`,
    });
    if (!confirmed) return;

    const idNews = newsWithImagesModel.id_news;
    this.mutation.run(
      this.newsGalleryService.delete_all(idNews).pipe(
        switchMap(() => this.newsService.delete(idNews))
      ),
      { isSaving: this.isSaving },
      {
        successMsg: 'Noticia eliminada correctamente',
        errorMsg: 'Error al eliminar la Noticia',
        onSuccess: () => this.refreshList(),
      }
    );
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
}
