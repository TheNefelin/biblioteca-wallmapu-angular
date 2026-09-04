import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { CreateGenreModel, GenreModel, UpdateGenreModel } from '@features/book-genre/models/genre-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'genre';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<GenreModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<GenreModel[]>>(
      this.endpoint, params
    );
  }

  getAll(): Observable<GenreModel[]> {
    return this.apiService.getAll<GenreModel[]>(
      this.endpoint
    );
  }

  create(item: CreateGenreModel): Observable<GenreModel> {
    return this.apiService.create<GenreModel, CreateGenreModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateGenreModel): Observable<GenreModel> {
    return this.apiService.update<GenreModel, UpdateGenreModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
