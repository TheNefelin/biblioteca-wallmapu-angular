import { AuthorModel } from "@features/book-author/models/author-model";
import { SubjectModel } from "@features/book-subject/models/subject-model";

export type BookFormVM = {
  id_book: number,
  title: string,
  summary: string,  
  genre_id: number,
  authors: AuthorModel[]
  subjects: SubjectModel[]
  created_at: string,
  updated_at: string,
};