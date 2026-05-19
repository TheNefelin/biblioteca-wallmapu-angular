export interface CreateEditorialModel {
  name: string;
}

export interface UpdateEditorialModel extends CreateEditorialModel {
  id_editorial: number;
}

export interface EditorialModel extends UpdateEditorialModel{
  created_at: string;
  updated_at: string;
}
