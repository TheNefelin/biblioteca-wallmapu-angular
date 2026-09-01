import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('debería anteponer apiUrl al endpoint (fix: no pegarle al index.html)', () => {
      service.getAll<string[]>('format').subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/format');
      expect(req.request.url).not.toBe('format');
      req.flush([]);
    });
  });

  describe('getAllPagination', () => {
    it('debería construir URL con page, limit y search', () => {
      const params: PaginationRequestModel<null> = { page: 2, limit: 10, search: 'Tapa', filter: null };
      service.getAllPagination('format', params).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/format/pagination?page=2&limit=10');
      expect(req.request.url).toContain('&search=Tapa');
      req.flush({ pages: 1, data: [] });
    });

    it('debería serializar el filtro genérico y omitir valores vacíos', () => {
      const params: PaginationRequestModel<{ id_author?: number; id_format?: number; id_genre?: number }> = {
        page: 1,
        limit: 10,
        search: '',
        filter: { id_author: 5, id_genre: 0, id_format: undefined },
      };
      service.getAllPagination('edition', params).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/edition/pagination?page=1&limit=10');
      expect(req.request.url).toContain('&id_author=5');
      expect(req.request.url).not.toContain('id_genre');
      expect(req.request.url).not.toContain('id_format');
      req.flush({ pages: 1, data: [] });
    });
  });

  describe('getById', () => {
    it('debería construir URL con apiUrl/endpoint/id', () => {
      service.getById('format', 3).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/format/3');
      req.flush({ id_format: 3 });
    });
  });

  describe('create', () => {
    it('debería hacer POST a apiUrl/endpoint con el body', () => {
      service.create('format', { name: 'Tapa Dura' }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/format');
      expect(req.request.body).toEqual({ name: 'Tapa Dura' });
      req.flush({ id_format: 1 });
    });
  });

  describe('update', () => {
    it('debería hacer PUT a apiUrl/endpoint/id', () => {
      service.update('format', 5, { id_format: 5, name: 'Ebook' }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/format/5');
      req.flush({ id_format: 5 });
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a apiUrl/endpoint/id', () => {
      service.delete('format', 7).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/format/7');
      req.flush(true);
    });
  });
});