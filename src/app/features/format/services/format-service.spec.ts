import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormatService } from './format-service';
import { PaginationRequestModel } from '@core/models/pagination-request-model';

describe('FormatService', () => {
  let service: FormatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(FormatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPagination', () => {
    it('debería construir la URL con page y limit sin search', () => {
      const params: PaginationRequestModel<null> = { page: 2, limit: 10, search: '', filter: null };
      service.getAllPagination(params).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/format/pagination?page=2&limit=10');
      req.flush({ pages: 1, data: [] });
    });

    it('debería incluir search cuando no está vacío', () => {
      const params: PaginationRequestModel<null> = { page: 1, limit: 10, search: 'Tapa', filter: null };
      service.getAllPagination(params).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('&search=Tapa');
      req.flush({ pages: 1, data: [] });
    });

    it('debería omitir search cuando está vacío', () => {
      const params: PaginationRequestModel<null> = { page: 1, limit: 10, search: '  ', filter: null };
      service.getAllPagination(params).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/format/pagination?page=1&limit=10');
      expect(req.request.url).not.toContain('search');
      req.flush({ pages: 1, data: [] });
    });
  });

  describe('create', () => {
    it('debería hacer POST a format con el payload', () => {
      service.create({ name: 'Tapa Dura' }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/format');
      expect(req.request.body).toEqual({ name: 'Tapa Dura' });
      req.flush({ id_format: 1, name: 'Tapa Dura' });
    });
  });

  describe('update', () => {
    it('debería hacer PUT a format/{id} con el payload', () => {
      service.update(5, { id_format: 5, name: 'Ebook' }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/format/5');
      expect(req.request.body).toEqual({ id_format: 5, name: 'Ebook' });
      req.flush({ id_format: 5, name: 'Ebook' });
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a format/{id}', () => {
      service.delete(3).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/format/3');
      req.flush(true);
    });
  });
});
