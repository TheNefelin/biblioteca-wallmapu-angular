import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { GenreModel, SaveGenreModel } from '@features/book-genre/models/genre-model';
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

  create(item: SaveGenreModel): Observable<GenreModel> {
    return this.apiService.create<GenreModel, SaveGenreModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: SaveGenreModel): Observable<GenreModel> {
    return this.apiService.update<GenreModel, SaveGenreModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
