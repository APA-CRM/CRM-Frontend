import {TaskStatusModel} from './statuses/task-status-model';
import {TaskPriorityModel} from './priorities/task-priority-model';
import {UserLightModel} from '../users/user-light-model';

export interface DetailedTaskModel {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number;
  status: TaskStatusModel;
  priority: TaskPriorityModel;
  assignedTo: UserLightModel;
  createdBy: UserLightModel;
  dueDate?: Date;
  completedAt?: Date;
  reminderAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
