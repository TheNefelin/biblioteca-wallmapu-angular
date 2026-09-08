export interface NotificationFilterModel {
  is_read: boolean;
}

export interface CreateNotificationByEmailModel {
  email: string;
  title: string;
  message: string;
  is_priority: boolean;
}

export interface NotificationModel extends CreateNotificationByEmailModel, NotificationFilterModel {
  id_notification: number;
  user_id: string;
  created_at: string;
}
