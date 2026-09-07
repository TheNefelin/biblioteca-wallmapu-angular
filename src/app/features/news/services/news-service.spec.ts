import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsService } from './news-service';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPagination', () => {
    it('debería hacer GET a apiUrl/news/pagination con los params', () => {
      service.getAllPagination({ page: 2, limit: 10, search: 'aniversario' }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/news/pagination?page=2&limit=10');
      expect(req.request.url).toContain('&search=aniversario');
      req.flush({ pages: 1, data: [] });
    });
  });

  describe('getById', () => {
    it('debería hacer GET a apiUrl/news/{id}', () => {
      service.getById(5).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/news/5');
      req.flush({ id_news: 5 });
    });
  });

  describe('create', () => {
    it('debería hacer POST a apiUrl/news con el payload', () => {
      const payload = { title: 'Titulo', subtitle: 'Subtitulo', body: 'Cuerpo' };
      service.create(payload).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/news');
      expect(req.request.body).toEqual(payload);
      req.flush({ id_news: 1 });
    });
  });

  describe('update', () => {
    it('debería hacer PUT a apiUrl/news/{id} con el payload', () => {
      const payload = { title: 'Titulo', subtitle: 'Subtitulo', body: 'Cuerpo' };
      service.update(4, payload).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/news/4');
      expect(req.request.body).toEqual(payload);
      req.flush({ id_news: 4 });
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a apiUrl/news/{id}', () => {
      service.delete(6).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/news/6');
      req.flush(true);
    });
  });
});
