import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewsService } from '@core/services/news-service';
import { News } from '@shared/models/news';
import { RouterLink } from "@angular/router";
import { catchError, of } from 'rxjs';
import { NewsCardComponent } from "@shared/components/news-card-component/news-card-component";

@Component({
  selector: 'app-latest-news-component',
  imports: [
    NewsCardComponent
],
  templateUrl: './latest-news-component.html',
})
export class LatestNewsComponent {
  private newsService = inject(NewsService);

  private newsResult = toSignal(
    this.newsService.getLast3().pipe(
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
