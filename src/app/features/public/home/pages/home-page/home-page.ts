import { Component, computed, inject } from '@angular/core';
import { RecommendedBooksComponent } from "@features/public/home/components/recommended-books-component/recommended-books-component";
import { ROUTES } from '@shared/constants/routes';
import { catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '@core/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsListComponent } from "@shared/components/news-list-component/news-list-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { API_RESPONSE_PAGINATION_NEWS_LIST } from '@shared/constants/default-api-result';

@Component({
  selector: 'app-home-page',
  imports: [
    RecommendedBooksComponent,
    HeaderComponent,
    SectionHeaderComponent,
    NewsListComponent,
    MessageErrorComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly ROUTES = ROUTES;
  private newsService = inject(NewsService);
  
  private readonly defaultApiResponse = API_RESPONSE_PAGINATION_NEWS_LIST;

  private newsSignal = toSignal(
    this.newsService.getAll(1,3,'').pipe(
      catchError((err) => {
        console.error('Error cargando noticia:', err);
        return of(this.defaultApiResponse);
      })
    ),
    { initialValue: undefined }
  );

  newsResult = computed(() => this.newsSignal() ?? this.defaultApiResponse);
  loading = computed(() => this.newsSignal() === undefined);  
}
