import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EditionService } from './edition-service';
import { SaveEditionModel } from '@features/edition/models/edition-model';

describe('EditionService', () => {
  let service: EditionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EditionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPagination', () => {
    it('debería hacer GET a apiUrl/edition/pagination', () => {
      service.getAllPagination({ page: 1, limit: 10, search: '', filter: undefined }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/edition/pagination');
      req.flush({ pages: 1, data: [] });
    });
  });

  describe('getAllByBook', () => {
    it('debería hacer GET a apiUrl/edition/book/{id} (contrato backend)', () => {
      service.getAllByBook(9).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/edition/book/9');
      req.flush([]);
    });
  });

  describe('getAllDetailByBook', () => {
    it('debería hacer GET a apiUrl/edition/book/{id}/detail (contrato backend)', () => {
      service.getAllDetailByBook(4).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/edition/book/4/detail');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('debería hacer GET a apiUrl/edition/{id} (contrato backend)', () => {
      service.getById(11).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/edition/11');
      req.flush({
        id_edition: 11,
        edition: '1ra Edición',
        isbn: '123',
        publication_year: 2020,
        pages: 100,
        cover_image: null,
        editorial_id: 2,
        book_id: 3,
        formats: [],
        created_at: '2026-01-01T00:00:00',
        updated_at: '2026-01-01T00:00:00',
      });
    });
  });

  describe('create', () => {
    it('debería hacer POST a apiUrl/edition con SaveEditionModel (format_ids)', () => {
      const payload: SaveEditionModel = {
        edition: '1ra Edición',
        isbn: '978-1234',
        publication_year: 2020,
        pages: 120,
        cover_image: null,
        book_id: 3,
        editorial_id: 2,
        format_ids: [1, 5],
      };
      service.create(payload).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/edition');
      expect(req.request.body).toEqual(payload);
      req.flush({ id_edition: 1 });
    });
  });

  describe('update', () => {
    it('debería hacer PUT a apiUrl/edition/{id} con SaveEditionModel (format_ids)', () => {
      const payload: SaveEditionModel = {
        edition: '1ra Edición',
        isbn: '978-1234',
        publication_year: 2020,
        pages: 120,
        cover_image: 'https://res.cloudinary.com/x/cover.png',
        book_id: 3,
        editorial_id: 2,
        format_ids: [1],
      };
      service.update(11, payload).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/edition/11');
      expect(req.request.body).toEqual(payload);
      req.flush({ id_edition: 11 });
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a apiUrl/edition/{id} (contrato backend)', () => {
      service.delete(7).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/edition/7');
      req.flush(true);
    });
  });
});
