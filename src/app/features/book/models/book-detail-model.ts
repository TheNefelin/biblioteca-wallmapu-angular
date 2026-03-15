import { AuthorModel } from "@features/book-author/models/author-model";
import { GenreModel } from "@features/book-genre/models/genre-model";
import { SubjectModel } from "@features/book-subject/models/subject-model";
import { EditionDetailModel } from "@features/edition/models/edition-detail-model";

export interface BookDetailModel {
  id_book: number,
  title: string,
  summary: string,  
  genre: GenreModel,
  created_at: string,
  updated_at: string,  
  authors: AuthorModel[]
  subjects: SubjectModel[]
  editions: EditionDetailModel[]
}
