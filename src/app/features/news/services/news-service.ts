import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { CreateNewsModel, NewsModel, UpdateNewsModel } from '@features/news/models/news-model';
import { Observable } from 'rxjs';
import { ApiResponseService } from '@core/services/api-response-service';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'news';

  getAll(params: PaginationRequestModel): Observable<PaginationResponseModel<NewsWithImagesModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.ApiResponseService.getAll<PaginationResponseModel<NewsWithImagesModel[]>>(
      `${this.endpoint}/${path}`
    );
  }

  getById(id: number): Observable<NewsWithImagesModel | null> {
    return this.ApiResponseService.getById<NewsWithImagesModel | null>(
      this.endpoint, id
    );
  }

  create(item: CreateNewsModel): Observable<NewsModel> {
    return this.ApiResponseService.create<NewsModel, CreateNewsModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateNewsModel): Observable<NewsModel> {
    return this.ApiResponseService.update<NewsModel, UpdateNewsModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<string> {
    return this.ApiResponseService.delete<string>(
      this.endpoint, id
    );
  }
}
