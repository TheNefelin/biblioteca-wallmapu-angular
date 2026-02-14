import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { ApiResponseModel } from '@core/models/api-response-model';
import { FormNewsModel, NewsWithImagesModel, NewsModel } from '@core/models/news-model';
import { PaginationModel } from '@core/models/pagination-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'news';

  getAll(currentPage: number, maxItems:number, search: string = ""): Observable<ApiResponseModel<PaginationModel<NewsWithImagesModel[]>>> {
    return this.apiResponseService.getAll<ApiResponseModel<PaginationModel<NewsWithImagesModel[]>>>(
      `${this.endpoint}/?page=${currentPage}&items=${maxItems}&search=${search}`
    );
  }

  getById(id: number): Observable<ApiResponseModel<NewsWithImagesModel | null>> {
    return this.apiResponseService.getById<ApiResponseModel<NewsWithImagesModel | null>>(
      this.endpoint, id
    );
  }

  create(item: FormNewsModel): Observable<ApiResponseModel<NewsModel>> {
    return this.apiResponseService.create<ApiResponseModel<NewsModel>, FormNewsModel>(
      this.endpoint, item
    );
  }

  update(item: FormNewsModel): Observable<ApiResponseModel<NewsModel>> {
    return this.apiResponseService.update<ApiResponseModel<NewsModel>, FormNewsModel>(
      this.endpoint, item.id_news, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<string>> {
    return this.apiResponseService.delete<ApiResponseModel<string>>(
      this.endpoint, id
    );
  }
}
