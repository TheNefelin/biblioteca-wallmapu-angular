export interface CreateFormatModel {
  name: string;
}

export interface UpdateFormatModel extends CreateFormatModel {
  id_format: number;
}

export interface FormatModel extends UpdateFormatModel {
  created_at: string;
  updated_at: string;
}
