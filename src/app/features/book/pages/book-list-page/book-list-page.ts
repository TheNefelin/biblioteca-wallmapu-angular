import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BookService } from '@features/book/services/book-service';
import { catchError, map, of, tap } from 'rxjs';
import { BookListComponent } from "@features/book/components/book-list-component/book-list-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { BookDetailModel } from '@features/book/models/book-model';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { ButtonRefreshComponent } from "@shared/components/button-refresh-component/button-refresh-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";

@Component({
  selector: 'app-book-list-page',
  imports: [
    BookListComponent,
    SectionHeaderComponent,
    MessageErrorComponent,
    PaginationComponent,
    MessageSuccessComponent,
    ButtonRefreshComponent,
    ModalActionComponent,
    ButtonCreateComponent
],
  templateUrl: './book-list-page.html',
})
export class BookListPage {
  private router = inject(Router);
  private readonly bookService = inject(BookService);

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed(() => this.bookRX.isLoading() || this.deleteBookRX.isLoading());
  readonly openDeleteModal = signal(false);
  readonly selectedBookToDelete = signal<BookDetailModel | null>(null);

  readonly currentPage = signal(1);
  private readonly search = signal('');
  readonly totalPages = signal<number>(0);

  readonly bookIdToDeletePayload = signal<number | null>(null)

  private readonly paramsPayload = computed<PaginationRequestModel>(() => ({
    page: this.currentPage(),
    limit: 10,
    search: this.search()
  }));  
    
  private readonly bookRX = rxResource({
    params: () => this.paramsPayload(),
    stream: ({ params }) => {

      return this.bookService.getAllPagination(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.data.pages);
          return response.data.data;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    },
  });

  private readonly deleteBookRX = rxResource({
    params: () => this.bookIdToDeletePayload(),
    stream: ({ params: payloadId }) => {
      if (payloadId === null) return of(null);
      this.successMessage.set(null);
      
      return this.bookService.delete(payloadId).pipe(
        map(response => {
          this.closeDeleteModal();
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.refreshList()
          this.bookIdToDeletePayload.set(null);
          this.selectedBookToDelete.set(null);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        }),
      );
    },
  });

  protected readonly bookComputedList = computed<BookDetailModel[]>(() => this.bookRX.value() ?? []);

  // ─── ACCIONES 
  protected refreshList(): void {
    this.bookRX.reload();
    this.errorMessage.set(null);
  }

  onCreate(){
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(0)]);
  }
  
  onEdit(bookModel: BookDetailModel) {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(bookModel.id_book)]);
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
