import { BookModel } from '@features/book/models/book-model';

export interface BookFormModel extends BookModel {
  authors: number[]
  subjects: number[]
}
