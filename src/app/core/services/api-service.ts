import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllPagination<T, F = null>(endpoint: string, params: PaginationRequestModel<F>): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/pagination${this.buildQuery(params)}`);
  }

  getAllPaginationByPath<T, F = null>(path: string, params: PaginationRequestModel<F>): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}${this.buildQuery(params)}`);
  }

  private buildQuery<F>(params: PaginationRequestModel<F>): string {
    let path = `?page=${params.page}&limit=${params.limit}`

    if (params.search && params.search.trim() !== '')
      path = `${path}&search=${params.search}`

    if (params.filter) {
      const filter = params.filter as Record<string, unknown>;
      for (const [key, value] of Object.entries(filter)) {
        if (value === null || value === undefined || value === '') continue;
        if (typeof value === 'number' && value <= 0) continue;
        path = `${path}&${key}=${value}`;
      }
    }

    return path;
  }

  getAll<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
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
