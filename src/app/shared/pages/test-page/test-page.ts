import { Component, computed, inject } from '@angular/core';
import { BookService } from '@core/services/book-service';
import { Book } from '@shared/models/book';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { CommonModule } from '@angular/common';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { NewsService } from '@core/services/news-service';
import { News } from '@shared/models/news';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";

@Component({
  selector: 'app-test-page',
  imports: [
    CommonModule,
    HeaderComponent,
    MessageErrorComponent,
    MessageSuccessComponent,
    AuthButtonComponent,
    SectionHeaderComponent
],
  templateUrl: './test-page.html',
})
export class TestPage {
  private bookService = inject(BookService);
  private newsService = inject(NewsService);

  // Convertir Observables a Signals
  private booksResult = toSignal(
    this.bookService.getTop12().pipe(
      catchError((err) => {
        console.error('Error cargando libros:', err);
        return of([] as Book[]);
      })
    ),
    { initialValue: undefined }
  );

  // Convertir Observables a Signals
  private newsResult = toSignal(
    this.newsService.getLast3().pipe(
      catchError((err) => {
        console.error('Error cargando noticias:', err);
        return of([] as News[]);
      })
    ),
    { initialValue: undefined }
  );
 
  books = computed(() => this.booksResult() ?? []);
  news = computed(() => this.newsResult() ?? []);

  // Computed para loading (true si alguno es undefined)
  loading = computed(() => 
    this.booksResult() === undefined || this.newsResult() === undefined
  );
}
