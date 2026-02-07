import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { ApiResponseModel } from '@core/models/api-response-model';
import { News } from '@shared/models/news';
import { PaginationModel } from '@shared/models/pagination-model';
import { Observable, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiResponseService = inject(ApiResponseService<News>)
  private readonly endpoint = 'news';

  getTop3(): Observable<ApiResponseModel<PaginationModel<News[]>>> {
    return this.apiResponseService.getAll(`${this.endpoint}/?page=1&page_size=3`);
  }

  getAll(currentPage: number, offset:number, search: string): Observable<ApiResponseModel<PaginationModel<News[]>>> {
    return this.apiResponseService.getAll(`${this.endpoint}/?page=${currentPage}&page_size=${offset}&search=${search}`);
  }

  getById(id: number): Observable<ApiResponseModel<News | null>> {
    return this.apiResponseService.getById(this.endpoint, id);
  }
  
  getAllTemp(): Observable<News[]> {
    return of(this.news);
  }

  news: News[] = [
    {
      "id_news": 1,
      "title": "Título Noticia 1",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-01-01",
      "images": [
        { "id_news_gallery": 1, "alt": "news-01", "img": "images/test/news-01.jpg", "news_id": 0 },
        { "id_news_gallery": 2, "alt": "news-02", "img": "images/test/news-02.jpg", "news_id": 0 },
        { "id_news_gallery": 3, "alt": "news-03", "img": "images/test/news-03.jpg", "news_id": 0 }
      ]
    },
    {
      "id_news": 2,
      "title": "Título Noticia 2",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-02-02",
      "images": [
        { "id_news_gallery": 2, "alt": "news-02", "img": "images/test/news-02.jpg", "news_id": 0 },
        { "id_news_gallery": 3, "alt": "news-03", "img": "images/test/news-03.jpg", "news_id": 0 },
        { "id_news_gallery": 1, "alt": "news-01", "img": "images/test/news-01.jpg", "news_id": 0 }
      ]
    },
    {
      "id_news": 3,
      "title": "Título Noticia 3",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-03-03",
      "images": [
        { "id_news_gallery": 3, "alt": "news-03", "img": "images/test/news-03.jpg", "news_id": 0 },
        { "id_news_gallery": 1, "alt": "news-01", "img": "images/test/news-01.jpg", "news_id": 0 },
        { "id_news_gallery": 2, "alt": "news-02", "img": "images/test/news-02.jpg", "news_id": 0 }
      ]
    },
    {
      "id_news": 4,
      "title": "Título Noticia 4",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-04-04",
      "images": [
        { "id_news_gallery": 1, "alt": "news-01", "img": "images/test/news-03.jpg", "news_id": 0 },
        { "id_news_gallery": 3, "alt": "news-03", "img": "images/test/news-03.jpg", "news_id": 0 },
        { "id_news_gallery": 2, "alt": "news-02", "img": "images/test/news-02.jpg", "news_id": 0 }
      ]
    },
    {
      "id_news": 5,
      "title": "Título Noticia 5",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-05-05",
      "images": [
        { "id_news_gallery": 2, "alt": "news-02", "img": "images/test/news-02.jpg", "news_id": 0 },
        { "id_news_gallery": 1, "alt": "news-01", "img": "images/test/news-01.jpg", "news_id": 0 },
        { "id_news_gallery": 3, "alt": "news-03", "img": "images/test/news-03.jpg", "news_id": 0 }
      ]
    },
    {
      "id_news": 6,
      "title": "Título Noticia 6",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-06-06",
      "images": [
        { "id_news_gallery": 3, "alt": "news-03", "img": "images/test/news-03.jpg", "news_id": 0 },
        { "id_news_gallery": 2, "alt": "news-02", "img": "images/test/news-02.jpg", "news_id": 0 },
        { "id_news_gallery": 1, "alt": "news-01", "img": "images/test/news-01.jpg", "news_id": 0 }
      ]
    }
  ]
}
