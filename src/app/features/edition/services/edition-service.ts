import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { CreateEditionModel, EditionDetailModel, EditionFilterModel, EditionModel, UpdateEditionModel } from '@features/edition/models/edition-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

@Injectable({
  providedIn: 'root',
})
export class EditionService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'edition';

  getAllPagination(params: PaginationRequestModel<EditionFilterModel>): Observable<PaginationResponseModel<EditionDetailModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<EditionDetailModel[]>, EditionFilterModel>(
      this.endpoint, params
    );
  }

  getAllDetailByBook(id_book: number): Observable<EditionDetailModel[]> {
    return this.apiService.getById<EditionDetailModel[]>(
      `${this.endpoint}/book`, `${id_book}/detail`
    );
  }

  getAllByBook(id_book: number): Observable<EditionModel[]> {
    return this.apiService.getById<EditionModel[]>(
      `${this.endpoint}/book`, id_book
    );
  }

  getById(id: number): Observable<EditionModel | null> {
    return this.apiService.getById<EditionModel | null>(
      this.endpoint, id
    );
  }

  create(item: CreateEditionModel): Observable<EditionModel> {
    return this.apiService.create<EditionModel, CreateEditionModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateEditionModel): Observable<EditionModel> {
    return this.apiService.update<EditionModel, UpdateEditionModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }
}
