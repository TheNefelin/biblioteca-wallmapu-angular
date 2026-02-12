import { Component, computed, inject, signal } from '@angular/core';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsService } from '@core/services/news-service';
import { API_RESPONSE_PAGINATION_NEWS_LIST } from '@shared/constants/default-api-result';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { NewsListComponent } from "@shared/components/news-list-component/news-list-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { Router } from '@angular/router';
import { NewsModel } from '@core/models/news-model';
import { ROUTES } from '@shared/constants/routes';
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";

@Component({
  selector: 'app-news-list-page',
  imports: [
    SectionHeaderComponent,
    PaginationComponent,
    NewsListComponent,
    MessageErrorComponent,
    ModalDeleteComponent
],
  templateUrl: './news-list-page.html',
})
export class NewsListPage {
  private router = inject(Router);
  private newsService = inject(NewsService);
  private readonly defaultApiResponse = API_RESPONSE_PAGINATION_NEWS_LIST;
  private readonly items = signal(10);
  private readonly search = signal('');
  private readonly refreshTrigger = signal(0);
  
  readonly showDeleteModal = signal(false);
  readonly selectedItem = signal<NewsModel | null>(null);

  readonly currentPage = signal(1);
  readonly totalPages = signal<number>(1);
  readonly loading = signal(true);

  private readonly params = computed(() => ({
    page: this.currentPage(),
    items: this.items(),
    search: this.search(),
    refresh: this.refreshTrigger(),
  }));  
  
  private readonly newsSignal = toSignal(
    toObservable(this.params).pipe( 
      tap(() => this.loading.set(true)),
      switchMap(params => 
        this.newsService.getAll(
          params.page,
          params.items,
          params.search
        ).pipe(
          tap(result => this.totalPages.set(result.result.pages || 1)),
          catchError(err => {
            console.error('Error cargando noticia:', err);
            return of(this.defaultApiResponse);
          }),
          finalize(() => this.loading.set(false)) 
        )
      ),
    ),
    { initialValue: undefined }
  );

  newsResult = computed(() => this.newsSignal() ?? this.defaultApiResponse);

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

  refreshList() {
    this.refreshTrigger.update(v => v + 1);
  }

  onCreate() {
    this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS, 'form']);
  }

  onDelete(item: NewsModel) {
    this.selectedItem.set(item);
    this.showDeleteModal.set(true);
  }

  closeModal() {
    this.showDeleteModal.set(false);
    this.selectedItem.set(null);
  }

  confirmDelete() {
    const item = this.selectedItem();
    if (!item) return;
  
    this.loading.set(true);
  
    this.newsService.delete(item.id_news).subscribe({
      next: () => {
        this.closeModal();
        this.refreshTrigger.update(v => v + 1);
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }  
}
