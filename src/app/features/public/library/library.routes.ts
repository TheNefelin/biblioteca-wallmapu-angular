import { Routes } from "@angular/router";
import { BooksPage } from "@features/public/library/pages/books-page/books-page";
import { BookDetailsPage } from "@features/public/library/pages/book-details-page/book-details-page";

export const  LIBRARY_ROUTES: Routes = [
  {
    path: '',
    component: BooksPage
  },
  {
    path: 'book/:id',
    component: BookDetailsPage
  },  
]