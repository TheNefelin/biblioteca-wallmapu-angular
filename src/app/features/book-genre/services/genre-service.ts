import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable } from 'rxjs';
import { CreateGenreModel, GenreModel, UpdateGenreModel } from '@features/book-genre/models/genre-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private ApiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'genre';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<GenreModel[]>> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`
   
    return this.ApiResponseService.getAll<PaginationResponseModel<GenreModel[]>>(
      `${this.endpoint}/pagination${path}`
    );
  }
  
  getAll(): Observable<GenreModel[]> {
    return this.ApiResponseService.getAll<GenreModel[]>(
      `${this.endpoint}/`
    );
  }

  create(item: CreateGenreModel): Observable<GenreModel> {
    return this.ApiResponseService.create<GenreModel, CreateGenreModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateGenreModel): Observable<GenreModel> {
    return this.ApiResponseService.update<GenreModel, UpdateGenreModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.ApiResponseService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
