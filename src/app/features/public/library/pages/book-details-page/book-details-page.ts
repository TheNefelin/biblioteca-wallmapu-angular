import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@core/services/book-service';
import { Book } from '@shared/models/book';

@Component({
  selector: 'app-book-details-page',
  imports: [
    CommonModule,
    NgOptimizedImage
],
  templateUrl: './book-details-page.html',
})
export class BookDetailsPage implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  
  book = signal<Book | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);

    this.bookService.getById(id).subscribe({
      next: (book) => {
        this.book.set(book);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading.set(false);
      }
    });
  }  
}
