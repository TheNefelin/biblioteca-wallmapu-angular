export interface SaveEditorialModel {
  name: string;
}

export interface EditorialModel extends SaveEditorialModel {
  id_editorial: number;
  created_at: string;
  updated_at: string;
}
