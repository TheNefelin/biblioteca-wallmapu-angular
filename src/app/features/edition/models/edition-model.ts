import { FormatModel } from "@features/format/models/format-model";

export interface BaseEditionModel {
  edition: string | null;
  isbn: string | null;
  publication_year: number;
  pages: number;
  cover_image: string | null;
  book_id: number;
  editorial_id: number;
}

export interface SaveEditionModel extends BaseEditionModel {
  format_ids?: number[];
}

export interface EditionModel extends BaseEditionModel {
  id_edition: number;
  formats: FormatModel[]
  created_at: string;
  updated_at: string;
}

export interface EditionDetailModel extends BaseEditionModel {
  id_edition: number;
  created_at: string;
  updated_at: string;
  editorial_name: string;
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