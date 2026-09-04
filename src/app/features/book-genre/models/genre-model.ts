
export interface SaveGenreModel {
  name: string;
}

export interface GenreModel extends SaveGenreModel {
  id_genre: number;
  created_at: string;
  updated_at: string;
}
