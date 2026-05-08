export interface CreateNotificationModel {
  title: string;
  message: string;
  is_priority: boolean;
  user_id: string;
}


export interface UpdateNotificationModel extends CreateNotificationModel {
  id_notification: number;
  is_read: boolean;
}


export interface NotificationModel extends UpdateNotificationModel {
  created_at: string;
}


export interface NotificationDetailModel extends NotificationModel {
  email: string;
}


export interface NotificationFilterModel {
  is_read?: boolean; // undefined = todos, false = no leídas, true = leídas
}

export interface CreateNotificationByEmailModel {
  email: string;
  title: string;
  message: string;
  is_priority: boolean;
}