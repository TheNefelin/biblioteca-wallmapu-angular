import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewsPage } from './news-page';
import { NewsService } from '@features/news/services/news-service';
import { PaginationResponseModel } from '@shared/models/pagination-response-model';
import { NewsModel } from '@features/news/models/news-model';

describe('NewsPage', () => {
  let fixture: ComponentFixture<NewsPage>;
  let newsServiceSpy: { getAllPagination: ReturnType<typeof vi.fn> };

  const newsItem: NewsModel = {
    id_news: 1,
    title: 'Noticia Test',
    subtitle: 'Subtítulo de la noticia',
    body: 'Cuerpo de la noticia',
    images: [],
    created_at: '2026-01-01T00:00:00',
    updated_at: '2026-01-01T00:00:00',
  };

  const paginatedResponse: PaginationResponseModel<NewsModel[]> = {
    page: 1,
    pages: 1,
    items: 1,
    next: null,
    prev: null,
    data: [newsItem],
  };

  beforeEach(async () => {
    newsServiceSpy = { getAllPagination: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [NewsPage],
      providers: [
        { provide: NewsService, useValue: newsServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsPage);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('debería cargar las noticias paginadas al inicializar', async () => {
    newsServiceSpy.getAllPagination.mockReturnValue(of(paginatedResponse));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.componentInstance as unknown as { newsList: () => NewsModel[] };
    expect(page.newsList()).toEqual([newsItem]);
  });

  it('debería renderizar el título de la noticia en el template', async () => {
    newsServiceSpy.getAllPagination.mockReturnValue(of(paginatedResponse));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Noticia Test');
  });

  it('debería tener el límite por defecto en 6', () => {
    const page = fixture.componentInstance as unknown as { limit: () => number };
    expect(page.limit()).toBe(6);
  });
});