import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { NewsModel, SaveNewsModel } from '@features/news/models/news-model';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'news';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<NewsModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<NewsModel[]>>(
      this.endpoint, params
    );
  }

  getById(id: number): Observable<NewsModel | null> {
    return this.apiService.getById<NewsModel | null>(
      this.endpoint, id
    );
  }

  create(item: SaveNewsModel): Observable<NewsModel> {
    return this.apiService.create<NewsModel, SaveNewsModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: SaveNewsModel): Observable<NewsModel> {
    return this.apiService.update<NewsModel, SaveNewsModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }
}
