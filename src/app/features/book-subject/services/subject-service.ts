import { inject, Injectable } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { ApiService } from '@core/services/api-service';
import { SaveSubjectModel, SubjectModel } from '@features/book-subject/models/subject-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'subject';

  getAllPagination(params: PaginationRequestModel<null>): Observable<PaginationResponseModel<SubjectModel[]>> {
    return this.apiService.getAllPagination<PaginationResponseModel<SubjectModel[]>>(
      this.endpoint, params
    );
  }

  getAll(): Observable<SubjectModel[]> {
    return this.apiService.getAll<SubjectModel[]>(
      this.endpoint
    );
  }

  create(item: SaveSubjectModel): Observable<SubjectModel> {
    return this.apiService.create<SubjectModel, SaveSubjectModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: SaveSubjectModel): Observable<SubjectModel> {
    return this.apiService.update<SubjectModel, SaveSubjectModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }  
}
