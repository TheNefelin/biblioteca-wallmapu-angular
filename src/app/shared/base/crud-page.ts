import { computed, signal } from '@angular/core';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';

export abstract class CrudPage<TModel> {
  protected readonly totalPages = signal<number>(1);
  protected readonly currentPage = signal<number>(1);
  protected readonly limit = signal<number>(10);
  protected readonly search = signal<string>('');

  // Compone el payload paginado que alimenta el rxResource de cada feature (GETALL).
  protected readonly getAllPayload = computed<PaginationRequestModel<null>>(() => ({
    page: this.currentPage(),
    limit: this.limit(),
    search: this.search(),
  }));

  // Mapea la respuesta paginada: actualiza totalPages y devuelve los items de la página actual.
  protected mapPaginated(response: PaginationResponseModel<TModel[]>): TModel[] {
    this.totalPages.set(response.pages);
    return response.data;
  }

  // Devuelve lista vacía y resetea totalPages (usada al fallar el GETALL o sin datos).
  protected emptyPaginated(): TModel[] {
    this.totalPages.set(1);
    return [];
  }

  // Contrato: cada feature implementa cómo recargar su propio listado (getAllRX.reload()).
  protected abstract reload(): void;

  // Actualiza búsqueda/límite y vuelve a la página 1 (se dispara al filtrar/buscar).
  protected onFilterChange(filter: { search: string; limit: number }): void {
    this.search.set(filter.search);
    this.limit.set(filter.limit);
    this.currentPage.set(1);
  }

  // Avanza a la página siguiente si existe.
  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(e => e + 1);
    }
  }

  // Retrocede a la página anterior si existe.
  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(e => e - 1);
    }
  }
}
