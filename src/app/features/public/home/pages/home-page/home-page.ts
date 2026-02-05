import { Component, computed, inject } from '@angular/core';
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { ROUTES } from '@shared/constants/routes';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsService } from '@core/services/news-service';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { News } from '@shared/models/news';
import { PaginationModel } from '@shared/models/pagination-model';
import { NewsListComponent } from "@shared/components/news-list-component/news-list-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-home-page',
  imports: [
    RecommendedBooksComponent,
    HeaderComponent,
    SectionHeaderComponent,
    NewsListComponent,
    LoadingComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly ROUTES = ROUTES;
  private newsService = inject(NewsService);
  
  private newsSignal = toSignal(
    this.newsService.getTop3().pipe(
      catchError((err) => {
        console.error('Error cargando libros:', err);
        return of({
          count: 0,
          pages: 0,
          next: '',
          prev: '',
          result: []
        } as PaginationModel<News[]>);
      })
    ),
    { initialValue: undefined }
  );

  newsResult = computed(() => this.newsSignal()?.result ?? []);
  loading = computed(() => this.newsSignal() === undefined);  
}
