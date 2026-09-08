import { beforeEach, describe, expect, it } from 'vitest';
import { CrudPage } from './crud-page';
import { PaginationResponseModel } from '@shared/models/pagination-response-model';

class TestCrudPage extends CrudPage<number> {
  protected override reload(): void {
    /* stub de prueba */
  }
}

interface TestCrudPageAccess {
  currentPage: () => number;
  totalPages: () => number;
  limit: () => number;
  search: () => string;
  getAllPayload: () => unknown;
  mapPaginated: (r: PaginationResponseModel<number[]>) => number[];
  emptyPaginated: () => number[];
  onFilterChange: (f: { search: string; limit: number }) => void;
  nextPage: () => void;
  prevPage: () => void;
}

describe('CrudPage', () => {
  let page: TestCrudPageAccess;

  beforeEach(() => {
    page = new TestCrudPage() as unknown as TestCrudPageAccess;
  });

  describe('estado inicial', () => {
    it('debería inicializar currentPage en 1, totalPages en 1 y search vacío', () => {
      expect(page.currentPage()).toBe(1);
      expect(page.totalPages()).toBe(1);
      expect(page.search()).toBe('');
    });

    it('debería construir el payload paginado con los valores actuales', () => {
      const payload = page.getAllPayload() as { page: number; limit: number; search: string };
      expect(payload).toEqual({ page: 1, limit: 10, search: '' });
    });
  });

  describe('mapPaginated', () => {
    it('debería actualizar totalPages y devolver los datos de la página', () => {
      const response: PaginationResponseModel<number[]> = {
        page: 2,
        pages: 5,
        items: 10,
        next: null,
        prev: null,
        data: [1, 2, 3],
      };

      const data = page.mapPaginated(response);

      expect(data).toEqual([1, 2, 3]);
      expect(page.totalPages()).toBe(5);
    });
  });

  describe('emptyPaginated', () => {
    it('debería resetear totalPages a 1 y devolver lista vacía', () => {
      page.mapPaginated({
        page: 1,
        pages: 4,
        items: 8,
        next: null,
        prev: null,
        data: [1, 2],
      });

      const data = page.emptyPaginated();

      expect(data).toEqual([]);
      expect(page.totalPages()).toBe(1);
    });
  });

  describe('onFilterChange', () => {
    it('debería actualizar búsqueda y límite, y volver a la página 1', () => {
      page.onFilterChange({ search: 'Tapa', limit: 60 });

      expect(page.search()).toBe('Tapa');
      expect(page.limit()).toBe(60);
      expect(page.currentPage()).toBe(1);
    });
  });

  describe('nextPage', () => {
    it('debería avanzar de página si existe siguiente', () => {
      page.mapPaginated({
        page: 1,
        pages: 3,
        items: 30,
        next: null,
        prev: null,
        data: [],
      });

      page.nextPage();
      expect(page.currentPage()).toBe(2);
    });

    it('no debería superar la última página', () => {
      page.mapPaginated({
        page: 1,
        pages: 2,
        items: 20,
        next: null,
        prev: null,
        data: [],
      });

      page.nextPage();
      page.nextPage();
      expect(page.currentPage()).toBe(2);
    });
  });

  describe('prevPage', () => {
    it('debería retroceder de página si existe anterior', () => {
      page.mapPaginated({
        page: 1,
        pages: 3,
        items: 30,
        next: null,
        prev: null,
        data: [],
      });
      page.nextPage();
      page.nextPage();
      expect(page.currentPage()).toBe(3);

      page.prevPage();
      expect(page.currentPage()).toBe(2);
    });

    it('no debería bajar de la primera página', () => {
      page.prevPage();
      expect(page.currentPage()).toBe(1);
    });
  });
});