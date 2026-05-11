export interface CreateCopyModel {
  signature_topography: string;
  edition_id: number;
  copy_number: number;
}

export interface UpdateCopyModel extends CreateCopyModel {
  id_copy: number;
  status_id: number;
}

export interface CopyModel extends UpdateCopyModel {
  barcode: string;
  created_at: string;
  updated_at: string;
}

export interface CopyDetailModel {
  id_copy: number;
  barcode: string;
  signature_topography: string;
  copy_number: number;
  created_at: string;
  updated_at: string;
  status_id: number;
  status_name: string;
  edition_id: number;
  edition_name: string;
  edition_isbn: string;
  edition_cover_image: string;
  editorial_id: number;
  editorial_name: string;
  is_availability: boolean;
  availability_status: string;
}
