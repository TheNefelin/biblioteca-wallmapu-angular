import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private path(namespace: string, resource: string): string {
    const parts = [namespace, resource].filter(p => p && p.length > 0);
    return `${this.apiUrl}/${parts.join('/')}`;
  }

  getAllPagination<T>(endpoint: string, params: PaginationRequestModel<null>): Observable<T> {
    let path = `?page=${params.page}&limit=${params.limit}`
    
    if (params.search && params.search.trim() != '')
      path = `${path}&search=${params.search}`

    return this.http.get<T>(`${this.apiUrl}/${endpoint}/pagination${path}`);
  }

  getAll<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint);
  }

  getById<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  create<T, TBody>(endpoint: string, body: TBody): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  update<T, TBody>(endpoint: string, id: number | string, body: TBody): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, body);
  }

  delete<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }
}
