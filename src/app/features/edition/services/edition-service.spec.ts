import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiService } from '@core/services/api-service';
import { PaginationRequestModel } from '@shared/models/pagination-request-model';
import { EditionFilterModel, SaveEditionModel } from '@features/edition/models/edition-model';
import { EditionService } from './edition-service';

describe('EditionService', () => {
  let service: EditionService;
  let apiServiceSpy: {
    getAllPagination: ReturnType<typeof vi.fn>;
    getById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  const saveEdition: SaveEditionModel = {
    edition: 'Primera',
    isbn: '1234567890',
    publication_year: 2020,
    pages: 100,
    cover_image: null,
    editorial_id: 1,
    book_id: 1,
    format_ids: [1, 2],
  };

  beforeEach(() => {
    apiServiceSpy = {
      getAllPagination: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    });

    service = TestBed.inject(EditionService);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPagination', () => {
    it('debería delegar a ApiService.getAllPagination con el endpoint edition', () => {
      const params: PaginationRequestModel<EditionFilterModel> = {
        page: 1,
        limit: 60,
        search: '',
        filter: { id_author: 5, id_editorial: 0, id_genre: 0, id_format: 0, id_subject: 0 },
      };
      apiServiceSpy.getAllPagination.mockReturnValue({ subscribe: vi.fn() } as never);

      service.getAllPagination(params);

      expect(apiServiceSpy.getAllPagination).toHaveBeenCalledWith('edition', params);
    });
  });

  describe('getAllDetailByBook', () => {
    it('debería delegar a ApiService.getById con la ruta edition/book/{id}/detail', () => {
      apiServiceSpy.getById.mockReturnValue({ subscribe: vi.fn() } as never);

      service.getAllDetailByBook(3);

      expect(apiServiceSpy.getById).toHaveBeenCalledWith('edition/book', '3/detail');
    });
  });

  describe('getAllByBook', () => {
    it('debería delegar a ApiService.getById con la ruta edition/book/{id}', () => {
      apiServiceSpy.getById.mockReturnValue({ subscribe: vi.fn() } as never);

      service.getAllByBook(3);

      expect(apiServiceSpy.getById).toHaveBeenCalledWith('edition/book', 3);
    });
  });

  describe('getById', () => {
    it('debería delegar a ApiService.getById con el endpoint edition', () => {
      apiServiceSpy.getById.mockReturnValue({ subscribe: vi.fn() } as never);

      service.getById(3);

      expect(apiServiceSpy.getById).toHaveBeenCalledWith('edition', 3);
    });
  });

  describe('create', () => {
    it('debería delegar a ApiService.create con el endpoint edition', () => {
      apiServiceSpy.create.mockReturnValue({ subscribe: vi.fn() } as never);

      service.create(saveEdition);

      expect(apiServiceSpy.create).toHaveBeenCalledWith('edition', saveEdition);
    });
  });

  describe('update', () => {
    it('debería delegar a ApiService.update con el endpoint edition y el id', () => {
      apiServiceSpy.update.mockReturnValue({ subscribe: vi.fn() } as never);

      service.update(5, saveEdition);

      expect(apiServiceSpy.update).toHaveBeenCalledWith('edition', 5, saveEdition);
    });
  });

  describe('delete', () => {
    it('debería delegar a ApiService.delete con el endpoint edition y el id', () => {
      apiServiceSpy.delete.mockReturnValue({ subscribe: vi.fn() } as never);

      service.delete(7);

      expect(apiServiceSpy.delete).toHaveBeenCalledWith('edition', 7);
    });
  });
});