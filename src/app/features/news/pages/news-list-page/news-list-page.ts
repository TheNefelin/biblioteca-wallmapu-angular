import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NewsService } from '@features/news/services/news-service';
import { catchError, map, of, switchMap } from 'rxjs';
import { NewsListComponent } from "@features/news/components/news-list-component/news-list-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsGalleryService } from '@features/news-gallery/services/news-gallery-service';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CrudPage } from '@shared/base/crud-page';
import { NewsModel } from '@features/news/models/news-model';

@Component({
  selector: 'app-news-list-page',
  imports: [
    NewsListComponent,
    SectionHeaderComponent,
],
  templateUrl: './news-list-page.html',
})
export class NewsListPage extends CrudPage<NewsModel> {
  private router = inject(Router);
  private readonly newsService = inject(NewsService)
  private readonly newsGalleryService = inject(NewsGalleryService)
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

  readonly isSaving = signal(false);
  readonly dataList = computed<NewsModel[]>(() => this.getNewsRX.value() ?? []);
  readonly isLoading = computed(() => this.getNewsRX.isLoading());

  private readonly getNewsRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[NewsService::NewsListPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  protected override reload(): void {
    this.getNewsRX.reload();
  }

  onCreate(){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM(0)]);
  }

  onEdit(item: NewsModel){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.NEWS.FORM(item.id_news)]);
  }

  protected async onDelete(item: NewsModel): Promise<void> {
    if (!item) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Noticia',
      message: `Estás seguro que deseas eliminar la noticia "${item.title}"?`,
    });
    if (!confirmed) return;

    const idNews = item.id_news;
    this.mutation.run(
      this.newsGalleryService.delete_all(idNews).pipe(
        switchMap(() => this.newsService.delete(idNews))
      ),
      { isSaving: this.isSaving },
      {
        successMsg: 'Noticia eliminada correctamente',
        errorMsg: 'Error al eliminar la Noticia',
        onSuccess: () => this.reload(),
      }
    );
  }

  searchText(text: string) {
    this.onFilterChange({ search: text, limit: this.limit() });
  }
}
