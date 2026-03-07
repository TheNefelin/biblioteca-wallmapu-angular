import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'subject';

  getAll(): Observable<ApiResponseModel<SubjectModel[]>> {
    return this.apiResponseService.getAll<ApiResponseModel<SubjectModel[]>>(
      `${this.endpoint}`
    );
  }
}
