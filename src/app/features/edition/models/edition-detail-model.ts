import { AuthorModel } from "@features/book-author/models/author-model"
import { EditorialModel } from "@features/book-editorial/models/editorial-model"
import { GenreModel } from "@features/book-genre/models/genre-model"
import { SubjectModel } from "@features/book-subject/models/subject-model"
import { EditionCopyDetailModel } from "@features/edition-copy/models/edition-copy-detail-model"


export interface EditionBookModel {
  id_book: number,
  title: string,
  summary: string,
  created_at: string,
  updated_at: string,  
  genre: GenreModel,
  authors: AuthorModel[]
  subjects: SubjectModel[]
}


export interface EditionDetailModel {
  id_edition: number,
  edition: string,
  isbn: string,
  publication_year: number,
  pages: number,
  cover_image: string | null,
  created_at: string,
  updated_at: string,
  book: EditionBookModel,  
  editorial: EditorialModel,
  copies: EditionCopyDetailModel[],
}
