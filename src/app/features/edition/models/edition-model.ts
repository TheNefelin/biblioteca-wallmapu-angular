import { FormatModel } from "@features/format/models/format-model";

export interface CreateEditionModel {
  edition: string;
  isbn: string;
  publication_year: number;
  pages: number;
  cover_image: string | null;
  book_id: number;
  editorial_id: number;
  format_ids?: number[];
}

export interface UpdateEditionModel extends CreateEditionModel {
  id_edition: number;
}

export interface EditionModel {
  id_edition: number;
  edition: string;
  isbn: string;
  publication_year: number;
  pages: number;
  cover_image: string | null;
  book_id: number;
  editorial_id: number;
  formats: FormatModel[]
  created_at: string;
  updated_at: string;
}

export interface EditionDetailModel {
  id_edition: number;
  edition: string;
  isbn: string;
  publication_year: number;
  pages: number;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
  editorial_id: number;
  editorial_name: string;
  book_id: number;
  book_title: string;
  genre_id: number;
  genre_name: string;
  author_id: number;
  author_name: string;
  copy_count: number;
}

export interface EditionFilterModel {
  id_author?: number;
  id_editorial?: number;
  id_genre?: number;
  id_format?: number;
  id_subject?: number;
}