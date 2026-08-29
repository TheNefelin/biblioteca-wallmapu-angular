import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CreateGenreModel, GenreModel, UpdateGenreModel } from '@features/book-genre/models/genre-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'genre';

  getAllPagination(params: PaginationRequestModel<null>): Observable<ApiResponseModel<PaginationResponseModel<GenreModel[]>>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.apiResponseService.getAll<ApiResponseModel<PaginationResponseModel<GenreModel[]>>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<ApiResponseModel<GenreModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<GenreModel[]>>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateGenreModel): Observable<ApiResponseModel<GenreModel>> {
    return this.apiResponseService.create<ApiResponseModel<GenreModel>, CreateGenreModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateGenreModel): Observable<ApiResponseModel<GenreModel>> {
    return this.apiResponseService.update<ApiResponseModel<GenreModel>, UpdateGenreModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<ApiResponseModel<boolean>> {
    return this.apiResponseService.delete<ApiResponseModel<boolean>>(
      this.endpoint, id
    );
  }  
}
