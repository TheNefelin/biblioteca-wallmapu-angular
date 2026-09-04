export interface SaveSubjectModel {
  name: string;
}

export interface SubjectModel extends SaveSubjectModel {
  id_subject: number;
  created_at: string;
  updated_at: string;
}
