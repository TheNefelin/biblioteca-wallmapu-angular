import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { AuthorModel, SaveAuthorModel } from '@features/book-author/models/author-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'author';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<AuthorModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<AuthorModel[]>>(
      this.endpoint, params
    );
  }

  getAll(): Observable<AuthorModel[]> {
    return this.apiService.getAll<AuthorModel[]>(
      this.endpoint
    );
  }

  create(item: SaveAuthorModel): Observable<AuthorModel> {
    return this.apiService.create<AuthorModel, SaveAuthorModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: SaveAuthorModel): Observable<AuthorModel> {
    return this.apiService.update<AuthorModel, SaveAuthorModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }
}
