export interface SaveAuthorModel {
  name: string;
}

export interface AuthorModel extends SaveAuthorModel {
  id_author: number;
  created_at: string;
  updated_at: string;
}
