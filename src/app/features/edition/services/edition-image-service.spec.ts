import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EditionImageService } from './edition-image-service';

describe('EditionImageService', () => {
  let service: EditionImageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EditionImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('upload', () => {
    it('debería hacer POST a apiUrl/edition-image con FormData', () => {
      const file = new File(['data'], 'cover.png', { type: 'image/png' });
      service.upload(file).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/edition-image');
      expect(req.request.body).toBeInstanceOf(FormData);
      expect((req.request.body as FormData).get('file')).toEqual(file);
      req.flush('https://res.cloudinary.com/x/cover.png');
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a apiUrl/edition-image/{id}', () => {
      service.delete(42).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/edition-image/42');
      req.flush(true);
    });
  });
});