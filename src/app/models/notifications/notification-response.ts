import {NotificationType} from '../../core/enums/notification-type';

export interface NotificationResponse {
  title: string;
  messageCode: NotificationType;
  message: string;
  details: Record<string, any>;
}
