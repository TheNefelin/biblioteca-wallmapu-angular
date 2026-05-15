import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { extractErrorMessage } from '@core/utils/error-handler';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { catchError, map, of } from 'rxjs';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { NewsCardListComponent } from "@features/news/components/news-card-list-component/news-card-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";

@Component({
  selector: 'app-news-page',
  imports: [
    HeaderComponent, 
    NewsCardListComponent, 
    SectionHeaderComponent, 
    PaginationComponent,
  ],
  templateUrl: './news-page.html',
})
export class NewsPage {
  readonly totalPages = signal<number>(1);
  readonly currentPage = signal(1);
  private readonly items = signal(6);
  private readonly search = signal('');
  
  readonly errorMessage = signal<string | null>(null);
  readonly isLoading = computed(() => this.getNewsRX.isLoading());

  private readonly newsService = inject(NewsService);
  private readonly getNewsPayload = computed<PaginationRequestModel>(() => ({
    page: this.currentPage(),
    limit: this.items(),
    search: this.search(),
  }));  
  readonly ComputedNewsWithImagesList = computed<NewsWithImagesModel[]>(() => this.getNewsRX.value() ?? []);

  private readonly getNewsRX = rxResource({
    params: () => this.getNewsPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

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
