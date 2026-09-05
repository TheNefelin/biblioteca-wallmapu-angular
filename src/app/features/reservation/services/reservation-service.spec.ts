import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservationService } from './reservation-service';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPagination', () => {
    it('debería hacer GET a apiUrl/reservations/pagination', () => {
      service.getAllPagination({ page: 1, limit: 10, search: '', filter: { id_status: 0 } }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/reservations/pagination');
      expect(req.request.url).not.toContain('id_status=0');
      req.flush({ pages: 1, data: [] });
    });
  });

  describe('getByUserPagination', () => {
    it('debería hacer GET a apiUrl/reservations/pagination/user (contrato backend)', () => {
      service.getByUserPagination({ page: 1, limit: 10, search: '', filter: { id_status: 0 } }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/reservations/pagination/user');
      req.flush({ pages: 1, data: [] });
    });
  });

  describe('getById', () => {
    it('debería hacer GET a apiUrl/reservations/{id}', () => {
      service.getById(11).subscribe();

      const req = httpMock.expectOne(r => r.method === 'GET');
      expect(req.request.url).toContain('/api/reservations/11');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('debería hacer POST a apiUrl/reservations con copy_id', () => {
      service.create({ copy_id: 12 }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/reservations');
      expect(req.request.body).toEqual({ copy_id: 12 });
      req.flush({ id_reservation: 1 });
    });
  });

  describe('pickup', () => {
    it('debería hacer PUT a apiUrl/reservations/{id}/pickup con copy_id', () => {
      service.pickup({ id_reservation: 7, copy_id: 12 }).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/reservations/7/pickup');
      expect(req.request.body).toEqual({ copy_id: 12 });
      req.flush({ id_reservation: 7 });
    });
  });

  describe('cancel', () => {
    it('debería hacer PUT a apiUrl/reservations/{id}/cancel', () => {
      service.cancel(7).subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/reservations/7/cancel');
      req.flush({ id_reservation: 7 });
    });
  });

  describe('expire', () => {
    it('debería hacer PUT a apiUrl/reservations/expire-overdue', () => {
      service.expire().subscribe();

      const req = httpMock.expectOne(r => r.method === 'PUT');
      expect(req.request.url).toContain('/api/reservations/expire-overdue');
      req.flush(1);
    });
  });
});