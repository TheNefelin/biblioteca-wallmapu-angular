import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { EditionPage } from './edition-page';
import { EditionService } from '@features/edition/services/edition-service';
import { GenreService } from '@features/book-genre/services/genre-service';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { AuthorService } from '@features/book-author/services/author-service';
import { FormatService } from '@features/format/services/format-service';
import { SubjectService } from '@features/book-subject/services/subject-service';
import { PaginationResponseModel } from '@shared/models/pagination-response-model';
import { EditionDetailModel } from '@features/edition/models/edition-model';

describe('EditionPage', () => {
  let fixture: ComponentFixture<EditionPage>;
  let editionServiceSpy: { getAllPagination: ReturnType<typeof vi.fn> };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  const editionDetail: EditionDetailModel = {
    id_edition: 1,
    created_at: '2026-01-01T00:00:00',
    updated_at: '2026-01-01T00:00:00',
    editorial_name: 'Editorial Test',
    book_title: 'Libro Test',
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

  const paginatedResponse: PaginationResponseModel<EditionDetailModel[]> = {
    page: 1,
    pages: 2,
    items: 10,
    next: null,
    prev: null,
    data: [editionDetail],
  };

  beforeEach(async () => {
    editionServiceSpy = { getAllPagination: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EditionPage],
      providers: [
        { provide: EditionService, useValue: editionServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: GenreService, useValue: { getAll: () => of([]) } },
        { provide: EditorialService, useValue: { getAll: () => of([]) } },
        { provide: AuthorService, useValue: { getAll: () => of([]) } },
        { provide: FormatService, useValue: { getAll: () => of([]) } },
        { provide: SubjectService, useValue: { getAll: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditionPage);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('debería cargar las ediciones paginadas al inicializar', async () => {
    editionServiceSpy.getAllPagination.mockReturnValue(of(paginatedResponse));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.componentInstance as unknown as {
      edition: { dataList: () => EditionDetailModel[]; isLoading: () => boolean };
    };

    expect(page.edition.dataList()).toEqual([editionDetail]);
    expect(page.edition.isLoading()).toBe(false);
  });

  it('debería renderizar las tarjetas de ediciones en el template', async () => {
    editionServiceSpy.getAllPagination.mockReturnValue(of(paginatedResponse));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Libro Test');
  });

  it('debería navegar a la reserva al hacer click en una edición', async () => {
    editionServiceSpy.getAllPagination.mockReturnValue(of(paginatedResponse));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.componentInstance as unknown as {
      onNavigateTo: (item: EditionDetailModel) => void;
    };
    page.onNavigateTo(editionDetail);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      ROUTES_PATH_RESERVATION(editionDetail.book_id, editionDetail.id_edition),
    ]);
  });
});

function ROUTES_PATH_RESERVATION(bookId: number, editionId: number): string {
  return `reservation/book/${bookId}/edition/${editionId}`;
}