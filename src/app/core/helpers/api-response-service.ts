import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiResponseService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll<TResponse>(endpoint: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.apiUrl}/${endpoint}`);
  }

  getById<TResponse>(endpoint: string, id: string | number): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  create<TResponse, TBody>(endpoint: string, data: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiUrl}/${endpoint}`, data);
  }

  update<TResponse, TBody>(endpoint: string, id: string | number, data: TBody): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  delete<TResponse>(endpoint: string, id: string | number): Observable<TResponse> {
    return this.http.delete<TResponse>(`${this.apiUrl}/${endpoint}/${id}`);
  }
}
