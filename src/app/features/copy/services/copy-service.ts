import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api-service';
import { Observable } from 'rxjs';
import { CopyDetailModel, CopyModel, SaveCopyModel } from '@features/copy/models/copy-model';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  private apiService = inject(ApiService)
  private readonly endpoint = 'copy';

  getAllByEditionId(id_edition: number): Observable<CopyModel[]> {
    return this.apiService.getById<CopyModel[]>(
      `${this.endpoint}/edition`, id_edition
    );
  }

  getAllByBookId(id_book: number): Observable<CopyDetailModel[]> {
    return this.apiService.getById<CopyDetailModel[]>(
      `${this.endpoint}/detail/book`, id_book
    );
  }  

  create(item: SaveCopyModel): Observable<CopyModel> {
    return this.apiService.create<CopyModel, SaveCopyModel>(
      this.endpoint, item
    );
  }

  update(id: number, item: SaveCopyModel): Observable<CopyModel> {
    return this.apiService.update<CopyModel, SaveCopyModel>(
      this.endpoint, id, item
    );
  }

  delete(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(
      this.endpoint, id
    );
  }
}
