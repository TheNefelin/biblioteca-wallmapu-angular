import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { NewsService } from '@features/news/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { NewsCardListComponent } from "@features/news/components/news-card-list-component/news-card-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsModel } from '@features/news/models/news-model';
import { CrudPage } from '@shared/base/crud-page';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-news-page',
  imports: [
    HeaderComponent, 
    NewsCardListComponent, 
    SectionHeaderComponent, 
    PaginationComponent,
  ],
  templateUrl: './news-page.html',
})
export class NewsPage extends CrudPage<NewsModel> {
  private readonly newsService = inject(NewsService);

  protected override readonly limit = signal<number>(6);

  readonly isLoading = computed(() => this.getNewsRX.isLoading());
  readonly newsList = computed<NewsModel[]>(() => this.getNewsRX.value() ?? []);

  private readonly getNewsRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.newsService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(() => of(this.emptyPaginated()))
      );
},
  });

  protected override reload(): void {
    this.getNewsRX.reload();
  }

  searchText(text: string) {
    this.onFilterChange({ search: text, limit: this.limit() });
  }
}
