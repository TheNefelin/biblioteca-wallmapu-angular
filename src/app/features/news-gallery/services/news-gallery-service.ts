import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { NewsGalleryModel, SaveNewsGalleryModel } from '@features/news-gallery/models/news-gallery-model';

@Injectable({
  providedIn: 'root',
})
export class NewsGalleryService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'news-gallery';

  create(news_id: number, files: SaveNewsGalleryModel[]): Observable<NewsGalleryModel> {
    const formData = new FormData();

    files.forEach(e => {
      formData.append('files', e.file);
      formData.append('alts', e.alt);
    });

    return this.apiService.create<NewsGalleryModel, FormData>(
      `${this.endpoint}/news/${news_id}`, formData
    );
  }

  delete(id_news_gallery: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id_news_gallery
    );
  }

  delete_all(news_id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      `${this.endpoint}/news`, news_id
    );
  }
}
