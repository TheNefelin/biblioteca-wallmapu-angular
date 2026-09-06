export interface NotificationModel {
  id_notification: number;
  title: string;
  message: string;
  is_priority: boolean;
  user_id: string;
  is_read: boolean;
  created_at: string;
}


export interface NotificationDetailModel extends NotificationModel {
  email: string;
}


export interface NotificationFilterModel {
  is_read?: boolean; // undefined/true = todos (sin filtro), false = solo no leídas
}

export interface CreateNotificationByEmailModel {
  email: string;
  title: string;
  message: string;
  is_priority: boolean;
}