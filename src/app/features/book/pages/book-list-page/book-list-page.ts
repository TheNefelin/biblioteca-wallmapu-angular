import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookService } from '@features/book/services/book-service';
import { catchError, map, of } from 'rxjs';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { BookDetailModel } from '@features/book/models/book-model';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { CrudPage } from '@shared/base/crud-page';
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-book-list-page',
  imports: [
    DatePipe,
    NgOptimizedImage,
    SectionHeaderComponent,
    PaginationComponent,
    ButtonComponent,
    LoadingComponent
  ],
  templateUrl: './book-list-page.html',
})
export class BookListPage extends CrudPage<BookDetailModel> {
  // SERVICES ----------------------------------------------------------------------
  private router = inject(Router);
  private readonly bookService = inject(BookService);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

  protected readonly isSaving = signal<boolean>(false);
  protected readonly bookComputedList = computed<BookDetailModel[]>(() => this.getAllRX.value() ?? []);

  // FETCHS ------------------------------------------------------------------------
  protected readonly getAllRX = rxResource({
    params: () => this.getAllPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.bookService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[BookService::BookListPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllRX.reload();
  }

  protected onSearchFilter(searchText: string): void {
    this.onFilterChange({ search: searchText, limit: this.limit() });
  }

  // BOOK ACTIONS ------------------------------------------------------------------
  onCreate() {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(0)]);
  }

  onEdit(bookModel: BookDetailModel) {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(bookModel.id_book)]);
  }

  protected async onDelete(book: BookDetailModel): Promise<void> {
    if (!book) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Libro',
      message: `Estás seguro que deseas eliminar el libro (${book.title})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.bookService.delete(book.id_book),
      { isSaving: this.isSaving },
      {
        successMsg: `Libro: ${book.title} eliminado correctamente`,
        errorMsg: 'Error al eliminar el Libro',
        onSuccess: () => this.reload(),
      }
    );
  }
}