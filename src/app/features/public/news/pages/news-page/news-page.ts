import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '@shared/components/header-component/header-component';
import { NewsListComponent } from "@shared/components/news-list-component/news-list-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { NewsService } from '@core/services/news-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, defer, finalize, of, switchMap, tap } from 'rxjs';
import { PaginationModel } from '@shared/models/pagination-model';
import { News } from '@shared/models/news';
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { ApiResponseModel } from '@core/models/api-response-model';
import { CommonModule } from '@angular/common';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-news-page',
  imports: [
    CommonModule,
    HeaderComponent,
    NewsListComponent,
    SectionHeaderComponent,
    PaginationComponent,
    MessageErrorComponent
],
  templateUrl: './news-page.html',
})
export class NewsPage {
  private readonly newsService = inject(NewsService);

  // Estado 
  private readonly offset = signal(6);
  private readonly search = signal('');

  readonly currentPage = signal(1);
  readonly totalPages = signal<number>(1);
  readonly loading = signal(false);

  private readonly defaultApiResponse: ApiResponseModel<PaginationModel<News[]>> = {
    isSuccess: true,
    statusCode: 0,
    message: "",
    data: {
      count: 0,
      pages: 0,
      next: '',
      prev: '',
      result: [] 
    }
  }

  // Parámetros reactivos combinados 
  private readonly params = computed(() => ({
    page: this.currentPage(),
    offset: this.offset(),
    search: this.search()
  }));  

  // Observable reactivo que se dispara cuando cambian los parámetros
  private readonly newsSignal = toSignal(
    toObservable(this.params).pipe( 
      tap(() => this.loading.set(true)),  // ← CORRECCIÓN: toObservable(computed signal)
      switchMap(params => 
        this.newsService.getAll(
          params.page,
          params.offset,
          params.search
        ).pipe(
          tap(result => this.totalPages.set(result.data.pages || 1)),
          catchError(err => {
            console.error('Error cargando noticias:', err);
            return of(this.defaultApiResponse);
          }),
          finalize(() => this.loading.set(false)) 
        )
      ),
    ),
    { initialValue: undefined }
  );

  // Señales derivadas
  newsResult = computed(() => this.newsSignal() ?? this.defaultApiResponse);

  // Métodos 
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
