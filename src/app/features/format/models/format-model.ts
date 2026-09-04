export interface SaveFormatModel {
  name: string;
}

export interface FormatModel extends SaveFormatModel {
  id_format: number;
  created_at: string;
  updated_at: string;
}
