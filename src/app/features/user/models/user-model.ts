export interface CreateUserModel {
  email: string;
  name: string;
}

export interface UpdateUserModel {
  id_user: string
  name: string;
  lastname: string;
  rut: string;
  address: string;
  phone: string;
  commune_id: number;
}

export interface UpdateUserByAdminModel extends UpdateUserModel {
  user_role_id: number;
  user_status_id: number;
}

export interface UserModel {
  id_user: string;
  email: string;
  name: string;
  lastname: string;
  rut: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
  commune_id: number;
  user_role_id: number;
  user_status_id: number;
}


export interface UserDetailModel extends UserModel {
  commune_name: string;
  user_role_name: string;
  user_status_name: string;
}