import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
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
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'news';

  getAll(params: PaginationRequestModel): Observable<ApiResponseModel<PaginationResponseModel<NewsWithImagesModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
  
    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<NewsWithImagesModel[]>>>(
      `${this.endpoint}/${path}`
    );
  }

  getById(id: number): Observable<ApiResponseModel<NewsWithImagesModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<NewsWithImagesModel | null>>(
      this.endpoint, id
    );
  }

  create(item: CreateNewsModel): Observable<ApiResponseModel<NewsModel>> {
    return this.apiResponseService.create<ApiResponseModel<NewsModel>, CreateNewsModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateNewsModel): Observable<ApiResponseModel<NewsModel>> {
    return this.apiResponseService.update<ApiResponseModel<NewsModel>, UpdateNewsModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<string>> {
    return this.apiResponseService.delete<ApiResponseModel<string>>(
      this.endpoint, id
    );
  }
}
