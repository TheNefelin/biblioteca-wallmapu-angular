import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '@features/news/services/news-service';
import { catchError, map, of } from 'rxjs';
import { NewsDetailComponent } from "@features/news/components/news-detail-component/news-detail-component";
import { NewsDetailGalleryComponent } from "@features/news/components/news-detail-gallery-component/news-detail-gallery-component";
import { NewsModel } from '@features/news/models/news-model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-news-detail-page',
  imports: [
    NewsDetailComponent, 
    NewsDetailGalleryComponent,
  ],
  templateUrl: './news-detail-page.html',
})
export class NewsDetailPage {
  private readonly route = inject(ActivatedRoute);

  readonly paramId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const parsed = Number(params.get('id'));
        return Number.isFinite(parsed) ? parsed : 0;
      })
    ),
    { initialValue: 0 }
  );

  readonly isLoading = computed(() => this.getNewsRX.isLoading());

  private readonly newsService = inject(NewsService);
  readonly news = computed<NewsModel | null>(() => this.getNewsRX.value() ?? null);

  private readonly getNewsRX = rxResource({
    params: () => this.paramId(),
    stream: ({ params }) => {    
      if (!params) return of(null);

      return this.newsService.getById(params).pipe(
        catchError(err => {
          console.error('[NewsService::NewsDetailPage] getById:', err);
          return of(null);
        })
      );
    },
  });
}