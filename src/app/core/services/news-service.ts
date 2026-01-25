import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { News } from '@shared/models/news';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiService = inject(ApiResponseService<News>);

  getLast3(): Observable<News[]> {
    return of(this.news.slice(0, 3));
  }

  getAll(): Observable<News[]> {
    return of(this.news);
  }

  getById(id: number): Observable<News> {
    const news = this.news.find(n => n.id === id);
    return of(news!);
  }

  news: News[] = [
    {
      "id": 1,
      "title": "Título Noticia 1",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-01-01",
      "images": [
        { "id": 1, "alt": "news-01", "url": "images/test/news-01.jpg" },
        { "id": 2, "alt": "news-02", "url": "images/test/news-02.jpg" },
        { "id": 3, "alt": "news-03", "url": "images/test/news-03.jpg" }
      ]
    },
    {
      "id": 2,
      "title": "Título Noticia 2",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-02-02",
      "images": [
        { "id": 2, "alt": "news-02", "url": "images/test/news-02.jpg" },
        { "id": 3, "alt": "news-03", "url": "images/test/news-03.jpg" },
        { "id": 1, "alt": "news-01", "url": "images/test/news-01.jpg" }
      ]
    },
    {
      "id": 3,
      "title": "Título Noticia 3",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-03-03",
      "images": [
        { "id": 3, "alt": "news-03", "url": "images/test/news-03.jpg" },
        { "id": 1, "alt": "news-01", "url": "images/test/news-01.jpg" },
        { "id": 2, "alt": "news-02", "url": "images/test/news-02.jpg" }
      ]
    },
    {
      "id": 4,
      "title": "Título Noticia 4",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-04-04",
      "images": [
        { "id": 1, "alt": "news-01", "url": "images/test/news-03.jpg" },
        { "id": 3, "alt": "news-03", "url": "images/test/news-03.jpg" },
        { "id": 2, "alt": "news-02", "url": "images/test/news-02.jpg" }
      ]
    },
    {
      "id": 5,
      "title": "Título Noticia 5",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-05-05",
      "images": [
        { "id": 2, "alt": "news-02", "url": "images/test/news-02.jpg" },
        { "id": 1, "alt": "news-01", "url": "images/test/news-01.jpg" },
        { "id": 3, "alt": "news-03", "url": "images/test/news-03.jpg" }
      ]
    },
    {
      "id": 6,
      "title": "Título Noticia 6",
      "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "date": "2026-06-06",
      "images": [
        { "id": 3, "alt": "news-03", "url": "images/test/news-03.jpg" },
        { "id": 2, "alt": "news-02", "url": "images/test/news-02.jpg" },
        { "id": 1, "alt": "news-01", "url": "images/test/news-01.jpg" }
      ]
    }
  ]
}
