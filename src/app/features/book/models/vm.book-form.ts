import { AuthorModel } from "@features/book-author/models/author-model";
import { SubjectModel } from "@features/book-subject/models/subject-model";

export interface BookFormVM {
  id_book: number,
  title: string,
  summary: string,  
  genre_id: number,
  authors: AuthorModel[]
  subjects: SubjectModel[]
  created_at: string,
  updated_at: string,
}