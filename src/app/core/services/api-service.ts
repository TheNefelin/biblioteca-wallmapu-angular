import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

  getAll<T>(namespace: string, resource: string): Observable<T> {
    return this.http.get<T>(this.path(namespace, resource));
  }

  getById<T>(namespace: string, resource: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.path(namespace, resource)}/${id}`);
  }

  create<T, TBody>(namespace: string, resource: string, body: TBody): Observable<T> {
    return this.http.post<T>(this.path(namespace, resource), body);
  }

  update<T, TBody>(namespace: string, resource: string, id: number | string, body: TBody): Observable<T> {
    return this.http.put<T>(`${this.path(namespace, resource)}/${id}`, body);
  }

  delete<T>(namespace: string, resource: string, id: number | string): Observable<T> {
    return this.http.delete<T>(`${this.path(namespace, resource)}/${id}`);
  }
}
