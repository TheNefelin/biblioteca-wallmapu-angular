import { AuthorModel } from "@features/book-author/models/author-model"
import { GenreModel } from "@features/book-genre/models/genre-model"
import { SubjectModel } from "@features/book-subject/models/subject-model"

export interface CreateBookModel {
  title: string;
  summary: string;
  genre_id: number;
  author_ids: number[];
  subject_ids: number[];
}

export interface UpdateBookModel extends CreateBookModel {
  id_book: number;
}

export interface BookModel {
  id_book: number;
  title: string;
  summary: string;
  genre: GenreModel;
  authors: AuthorModel[];
  subjects: SubjectModel[];
  created_at: string;
  updated_at: string;
}

export interface BookDetailModel {
  id_book: number;
  title: string;
  created_at: string;
  updated_at: string;
  genre_id: number;
  genre_name: string;
  author_id: number;
  author_name: string;
  edition_cover_image: string | null;
  edition_count: number
  copy_count: number
}
