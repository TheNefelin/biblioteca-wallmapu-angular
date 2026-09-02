import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CopyService } from './copy-service';

describe('CopyService', () => {
  let service: CopyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CopyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllByEditionId', () => {
    it('debería hacer GET a apiUrl/copy/edition/{id}', () => {
      service.getAllByEditionId(9).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/copy/edition/9');
      req.flush([]);
    });
  });

  describe('getAllByBookId', () => {
    it('debería hacer GET a apiUrl/copy/detail/book/{id}', () => {
      service.getAllByBookId(4).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/copy/detail/book/4');
      req.flush([]);
    });
  });

  describe('create', () => {
    it('debería hacer POST a apiUrl/copy con el payload', () => {
      const payload = { signature_topography: 'ABCdef-c0-2026', edition_id: 9, copy_number: 1, status_id: 1 };
      service.create(payload).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/copy');
      expect(req.request.body).toEqual(payload);
      req.flush({ id_copy: 1 });
    });
  });

  describe('update', () => {
    it('debería hacer PUT a apiUrl/copy/{id} con el payload', () => {
      const payload = { id_copy: 3, signature_topography: 'X', edition_id: 9, copy_number: 2, status_id: 1 };
      service.update(3, payload).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/copy/3');
      expect(req.request.body).toEqual(payload);
      req.flush({ id_copy: 3 });
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a apiUrl/copy/{id}', () => {
      service.delete(7).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/copy/7');
      req.flush(true);
    });
  });
});