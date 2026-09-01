import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { CreateFormatModel, FormatModel, UpdateFormatModel } from '@features/format/models/format-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'format';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<FormatModel[]>> { 
    return this.apiService.getAllPagination<PaginationResponseModel<FormatModel[]>>(
      this.endpoint, params
    );
  }
  
  getAll(): Observable<FormatModel[]> {
    return this.apiService.getAll<FormatModel[]>(
      this.endpoint
    );
  }

  create(item: CreateFormatModel): Observable<FormatModel> {
    return this.apiService.create<FormatModel, CreateFormatModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: UpdateFormatModel): Observable<FormatModel> {
    return this.apiService.update<FormatModel, UpdateFormatModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
