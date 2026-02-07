import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '@core/services/news-service';
import { catchError, of, switchMap } from 'rxjs';
import { NewsDetailsComponent } from "../../components/news-details-component/news-details-component";
import { ApiResponseModel } from '@core/models/api-response-model';
import { News } from '@shared/models/news';
import { CommonModule } from '@angular/common';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-news-details-page',
  imports: [
    CommonModule,
    NewsDetailsComponent,
    MessageErrorComponent,
    LoadingComponent
],
  templateUrl: './news-details-page.html',
})
export class NewsDetailsPage {
  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  
  private readonly defaultApiResponse: ApiResponseModel<News | null> = {
    isSuccess: true,
    statusCode: 0,
    message: "",
    data: null
  }

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
