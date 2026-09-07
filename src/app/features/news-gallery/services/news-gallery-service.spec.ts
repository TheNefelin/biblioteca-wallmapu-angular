import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsGalleryService } from './news-gallery-service';
import { SaveNewsGalleryModel } from '@features/news-gallery/models/news-gallery-model';

describe('NewsGalleryService', () => {
  let service: NewsGalleryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(NewsGalleryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('debería hacer POST con FormData a apiUrl/news-gallery/news/{id}', () => {
      const file = new File(['foto'], 'foto.png', { type: 'image/png' });
      const images: SaveNewsGalleryModel[] = [{ file, alt: 'Fachada' }];

      service.create(3, images).subscribe();

      const req = httpMock.expectOne(r => r.method === 'POST');
      expect(req.request.url).toContain('/api/news-gallery/news/3');
      expect(req.request.body).toBeInstanceOf(FormData);
      const body = req.request.body as FormData;
      expect(body.get('files')).toEqual(file);
      expect(body.get('alts')).toBe('Fachada');
      req.flush([{ id_news_gallery: 1, alt: 'Fachada', url: '/img/foto.png', news_id: 3 }]);
    });
  });

  describe('delete', () => {
    it('debería hacer DELETE a apiUrl/news-gallery/{id}', () => {
      service.delete(9).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/news-gallery/9');
      req.flush(true);
    });
  });

  describe('delete_all', () => {
    it('debería hacer DELETE a apiUrl/news-gallery/news/{news_id}', () => {
      service.delete_all(7).subscribe();

      const req = httpMock.expectOne(r => r.method === 'DELETE');
      expect(req.request.url).toContain('/api/news-gallery/news/7');
      req.flush(true);
    });
  });
});