import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { EditorialModel, SaveEditorialModel } from '@features/book-editorial/models/editorial-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'editorial';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<EditorialModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<EditorialModel[]>>(
      this.endpoint, params
    );
  }

  getAll(): Observable<EditorialModel[]> {
    return this.apiService.getAll<EditorialModel[]>(
      this.endpoint
    );
  }

  create(item: SaveEditorialModel): Observable<EditorialModel> {
    return this.apiService.create<EditorialModel, SaveEditorialModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: SaveEditorialModel): Observable<EditorialModel> {
    return this.apiService.update<EditorialModel, SaveEditorialModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
