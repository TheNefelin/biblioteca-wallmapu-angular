import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/helpers/api-response-service';
import { ApiResponseModel } from '@core/models/api-response-model';
import { FormNewsModel, NewsWithImagesModel, NewsModel } from '@core/models/news-model';
import { PaginationModel } from '@core/models/pagination-model';
import { Observable, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiResponseService = inject(ApiResponseService<NewsWithImagesModel | NewsModel>)
  private readonly endpoint = 'news';

  getAll(currentPage: number, maxItems:number, search: string = ""): Observable<ApiResponseModel<PaginationModel<NewsWithImagesModel[]>>> {
    return this.apiResponseService.getAll(`${this.endpoint}/?page=${currentPage}&items=${maxItems}&search=${search}`);
  }

  getById(id: number): Observable<ApiResponseModel<NewsWithImagesModel | null>> {
    return this.apiResponseService.getById(this.endpoint, id);
  }

  create(item: FormNewsModel): Observable<ApiResponseModel<NewsModel | null>> {
    return this.apiResponseService.create(this.endpoint, item);
  }

  update(item: FormNewsModel): Observable<ApiResponseModel<NewsModel | null>> {
    return this.apiResponseService.update(this.endpoint, item.id_news, item);
  }

  delete(id: number): Observable<ApiResponseModel<string>> {
    return this.apiResponseService.delete(this.endpoint, id);
  }
}
