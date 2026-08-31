import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { Observable } from 'rxjs';
import { NewsGalleryModel } from '@features/news-gallery/models/news-gallery-model';
import { ApiService } from '@core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class NewsGalleryService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'news-gallery';

  create(news_id: number, files: File[], alts: string[]): Observable<ApiResponseModel<NewsGalleryModel[]>> {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });
  
    alts.forEach(alt => {
      formData.append('alts', alt);
    });
    
    return this.ApiService.create<ApiResponseModel<NewsGalleryModel[]>, FormData>(
      `${this.endpoint}/news/${news_id}`, formData
    );
  }

  delete(id_news_gallery: number): Observable<ApiResponseModel<string>> {
    return this.ApiService.delete<ApiResponseModel<string>>(
      this.endpoint, id_news_gallery
    );
  }

  delete_all(news_id: number): Observable<ApiResponseModel<string>> {
    return this.ApiService.delete<ApiResponseModel<string>>(
      `${this.endpoint}/news`, news_id
    );
  }
}
