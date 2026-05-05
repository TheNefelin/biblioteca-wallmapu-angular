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
