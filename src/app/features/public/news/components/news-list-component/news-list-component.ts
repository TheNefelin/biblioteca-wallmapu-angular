import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '@core/services/news-service';
import { NewsCardComponent } from '@shared/components/news-card-component/news-card-component';
import { News } from '@shared/models/news';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-news-list-component',
  imports: [
    NewsCardComponent,
  ],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent {
  private newsService = inject(NewsService);

  private newsResult = toSignal(
    this.newsService.getAll().pipe(
      catchError((err) => {
        console.error('Error cargando noticias:', err);
        return of([] as News[]);
      })
    ),
    { initialValue: undefined }
  );

  news = computed(() => this.newsResult() ?? []);
  loading = computed(() => this.newsResult() === undefined);
}
