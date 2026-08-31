import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { CreateNewsModel, NewsModel, UpdateNewsModel } from '@features/news/models/news-model';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api-service';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private ApiService = inject(ApiService)
  private readonly endpoint = 'news';

  getAll(params: PaginationRequestModel): Observable<ApiResponseModel<PaginationResponseModel<NewsWithImagesModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.ApiService.getAll<ApiResponseModel<PaginationResponseModel<NewsWithImagesModel[]>>>(
      `${this.endpoint}/${path}`
    );
  }

  getById(id: number): Observable<ApiResponseModel<NewsWithImagesModel | null>> {
    return this.ApiService.getById<ApiResponseModel<NewsWithImagesModel | null>>(
      this.endpoint, id
    );
  }

  create(item: CreateNewsModel): Observable<ApiResponseModel<NewsModel>> {
    return this.ApiService.create<ApiResponseModel<NewsModel>, CreateNewsModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateNewsModel): Observable<ApiResponseModel<NewsModel>> {
    return this.ApiService.update<ApiResponseModel<NewsModel>, UpdateNewsModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<string>> {
    return this.ApiService.delete<ApiResponseModel<string>>(
      this.endpoint, id
    );
  }
}
