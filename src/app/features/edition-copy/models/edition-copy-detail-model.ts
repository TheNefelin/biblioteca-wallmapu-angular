import { EditionCopyStatusModel } from "@features/edition-copy-status/models/edition-copy-status-model";

export interface EditionCopyDetailModel {
  id_copy: number,
  barcode: string,
  signature_topography: string,
  copy_number: number,
  created_at: string,
  updated_at: string,
  edition_id: number,
  status: EditionCopyStatusModel | null
}
