import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NewsService } from '@core/services/news-service';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { NewsDetailsComponent } from "@shared/components/news-details-component/news-details-component";
import { NewsGalleryComponent } from "@shared/components/news-gallery-component/news-gallery-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { API_RESPONSE_NEWS } from '@shared/constants/default-api-result';

@Component({
  selector: 'app-news-details-page',
  imports: [
    CommonModule,
    LoadingComponent,
    NewsDetailsComponent,
    MessageErrorComponent,
    NewsGalleryComponent
],
  templateUrl: './news-details-page.html',
})
export class NewsDetailsPage {
  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  
  private readonly defaultApiResponse = API_RESPONSE_NEWS;

  // ✅ Reactividad moderna con toSignal
  private newsSignal = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.newsService.getById(id).pipe(
          catchError(() => of(this.defaultApiResponse))
        );
      })
    ),
    { initialValue: undefined }
  );
  
  // ✅ Estados computados claros
  newsResult = computed(() => this.newsSignal() ?? this.defaultApiResponse);
  loading = computed(() => this.newsSignal() === undefined);
}
