export interface CreateBookModel {
  title: string,
  summary: string,
  genre_id: number,
  author_ids: number[],
  subject_ids: number[],  
}

export interface UpdateBookModel extends CreateBookModel {
  id_book: number,
}
export interface BookModel extends UpdateBookModel {
  created_at: string,
  updated_at: string,
}
