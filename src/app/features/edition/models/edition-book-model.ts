import { AuthorModel } from "@features/book-author/models/author-model"
import { EditorialModel } from "@features/book-editorial/models/editorial-model"
import { GenreModel } from "@features/book-genre/models/genre-model"
import { SubjectModel } from "@features/book-subject/models/subject-model"

export interface EditionBookModel {
  id_book: number,
  title: string,
  summary: string,
  created_at: string,
  updated_at: string,  
  genre: GenreModel,
  editorial: EditorialModel  
  authors: AuthorModel[]
  subjects: SubjectModel[]
}
