import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '@core/services/news-service';
import { catchError, of, switchMap } from 'rxjs';
import { NewsDetailsComponent } from "../../components/news-details-component/news-details-component";

@Component({
  selector: 'app-news-details-page',
  imports: [
    NewsDetailsComponent
  ],
  templateUrl: './news-details-page.html',
})
export class NewsDetailsPage {
  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  
  // ✅ Reactividad moderna con toSignal
  private newsSignal = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.newsService.getById(id).pipe(
          catchError(() => of(undefined))
        );
      })
    ),
    { initialValue: undefined }
  );
  
  // ✅ Estados computados claros
  newsResult = computed(() => this.newsSignal());
  loading = computed(() => this.newsSignal() === undefined);
}
