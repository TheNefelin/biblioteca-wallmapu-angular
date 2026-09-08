import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home-page';
import { NewsService } from '@features/news/services/news-service';
import { EditionService } from '@features/edition/services/edition-service';
import { GenreService } from '@features/book-genre/services/genre-service';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { AuthorService } from '@features/book-author/services/author-service';
import { FormatService } from '@features/format/services/format-service';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { PaginationResponseModel } from '@shared/models/pagination-response-model';
import { EditionDetailModel } from '@features/edition/models/edition-model';
import { NewsModel } from '@features/news/models/news-model';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let newsServiceSpy: { getAllPagination: ReturnType<typeof vi.fn> };
  let editionServiceSpy: { getAllPagination: ReturnType<typeof vi.fn> };

  const newsItem: NewsModel = {
    id_news: 1,
    title: 'Noticia Destacada',
    subtitle: 'Subtítulo',
    body: 'Cuerpo',
    images: [],
    created_at: '2026-01-01T00:00:00',
    updated_at: '2026-01-01T00:00:00',
  };

  const editionDetail: EditionDetailModel = {
    id_edition: 1,
    created_at: '2026-01-01T00:00:00',
    updated_at: '2026-01-01T00:00:00',
    editorial_name: 'Editorial Test',
    book_title: 'Libro de la Home',
    genre_id: 1,
    genre_name: 'Ficción',
    author_id: 1,
    author_name: 'Autor Test',
    copy_count: 2,
    edition: 'Primera',
    isbn: '1234567890',
    publication_year: 2020,
    pages: 100,
    cover_image: null,
    editorial_id: 1,
    book_id: 5,
  };

  beforeEach(async () => {
    newsServiceSpy = { getAllPagination: vi.fn() };
    editionServiceSpy = { getAllPagination: vi.fn() };

    newsServiceSpy.getAllPagination.mockReturnValue(
      of({ pages: 1, data: [newsItem] } as PaginationResponseModel<NewsModel[]>)
    );
    editionServiceSpy.getAllPagination.mockReturnValue(
      of({ pages: 1, data: [editionDetail] } as PaginationResponseModel<EditionDetailModel[]>)
    );

    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        RouterTestingModule.withRoutes([{ path: 'news', component: DummyComponent }]),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: {} } },
        { provide: NewsService, useValue: newsServiceSpy },
        { provide: EditionService, useValue: editionServiceSpy },
        { provide: GenreService, useValue: { getAll: () => of([]) } },
        { provide: EditorialService, useValue: { getAll: () => of([]) } },
        { provide: AuthorService, useValue: { getAll: () => of([]) } },
        { provide: FormatService, useValue: { getAll: () => of([]) } },
        { provide: SubjectService, useValue: { getAll: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('debería cargar noticias y ediciones al inicializar', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.componentInstance as unknown as {
      news: { first: () => NewsModel | null };
      edition: { dataList: () => EditionDetailModel[] };
    };

    expect(page.news.first()?.id_news).toBe(1);
    expect(page.edition.dataList()).toEqual([editionDetail]);
  });

  it('debería renderizar la noticia destacada y el catálogo en el template', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Noticia Destacada');
    expect(html.textContent).toContain('Libro de la Home');
  });

  it('debería navegar a /news al pulsar el botón de acción', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.detectChanges();
    await fixture.whenStable();

    const page = fixture.componentInstance as unknown as { actionClicked: () => void };
    page.actionClicked();

    expect(navigateSpy).toHaveBeenCalledWith(['/news']);
  });
});

import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}