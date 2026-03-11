import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookDetailModel } from '@features/book/models/book-detail-model';
import { BookService } from '@features/book/services/book-service';
import { catchError, map, of, tap } from 'rxjs';
import { BookListComponent } from "@features/book/components/book-list-component/book-list-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";

@Component({
  selector: 'app-book-list-page',
  imports: [
    BookListComponent,
    SectionHeaderComponent,
    MessageErrorComponent,
    PaginationComponent,
    ModalDeleteComponent
],
  templateUrl: './book-list-page.html',
})
export class BookListPage {
  private router = inject(Router);
  private readonly bookService = inject(BookService);

  readonly backendError = signal<string | null>(null);
  readonly openDeleteModal = signal(false);
  readonly selectedBookToDelete = signal<BookDetailModel | null>(null);

  readonly currentPage = signal(1);
  private readonly items = signal(10);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);
  private readonly refreshTrigger = signal(0);

  readonly bookIdToDeletePayload = signal<number | null>(null)

  private readonly paramsPayload = computed(() => ({
    currentPage: this.currentPage(),
    items: this.items(),
    search: this.search(),
    refresh: this.refreshTrigger(),
  }));  
    
  private readonly bookRX = rxResource({
    params: () => this.paramsPayload(),
    stream: ({ params }) => {
      this.backendError.set(null);

      return this.bookService.getAll(
        params.currentPage, 
        params.items, 
        params.search
      ).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.result.pages);
          return response.result.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.backendError.set(message);
          return of(null);
        })
      );
    },
  });

  private readonly deleteBookRX = rxResource({
    params: () => this.bookIdToDeletePayload(),
    stream: ({ params: payloadId }) => {
      this.backendError.set(null);
      if (payloadId === null) return of(null);

      return this.bookService.delete(payloadId).pipe(
        map(response => {
          this.closeDeleteModal();
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(() => {
          this.refreshList()
          this.bookIdToDeletePayload.set(null);
          this.selectedBookToDelete.set(null);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.backendError.set(message);
          return of(null);
        }),
      );
    },
  });

  protected readonly isLoading = computed(() => this.bookRX.isLoading() || this.deleteBookRX.isLoading());
  protected readonly errorMessage = computed(() => this.backendError());
  protected readonly bookComputedList = computed<BookDetailModel[]>(() => this.bookRX.value() ?? []);

  // ─── ACCIONES 
  refreshList() {
    this.refreshTrigger.update(v => v + 1);
  }

  onCreate(){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM, 0]);
  }
  
  onEdit(bookModel: BookDetailModel) {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM, bookModel.id_book]);
  }

  onDelete(selectedBookToDelete: BookDetailModel) {
    if (!selectedBookToDelete) return;
    this.selectedBookToDelete.set(selectedBookToDelete)
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    this.bookIdToDeletePayload.set(null);
    const selectedBookToDelete = this.selectedBookToDelete();
    if (!selectedBookToDelete) return;
    this.bookIdToDeletePayload.set(selectedBookToDelete.id_book);
  } 

  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }

  // ─── PAGINACION  
  searchText(text: string) {
    this.search.set(text);
    this.currentPage.set(1); 
    }

  nextPage() {
    if (this.currentPage() < this.totalPages()){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }
}
