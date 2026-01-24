import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '@core/services/book-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { PaletteComponent } from "@shared/components/palette-component/palette-component";
import { Book } from '@shared/models/book';

@Component({
  selector: 'app-palette-page',
  imports: [
    CommonModule,
    HeaderComponent, 
    PaletteComponent,
  ],
  templateUrl: './palette-page.html',
})
export class PalettePage implements OnInit {
  private bookService = inject(BookService);
  
  books = signal<Book[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    
    // Llamar al servicio
    this.bookService.getTop12().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando libros:', err);
        this.loading.set(false);
      }
    });
  }
}
