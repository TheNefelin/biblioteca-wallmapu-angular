import { EditionCopyDetailModel } from "@features/edition-copy/models/edition-copy-detail-model";

export interface EditionFormVM {
  id_edition: number,
  edition: string,
  isbn: string,
  publication_year: number,
  pages: number,
  cover_image: string | null,
  book_id: number,
  editorial_id: number
  created_at?: string,
  updated_at?: string,
  file: File | null,
  isNewImg: boolean,
  copies: EditionCopyDetailModel[], 
}
