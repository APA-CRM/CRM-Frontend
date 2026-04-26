import {TaskStatusModel} from './statuses/task-status-model';
import {TaskPriorityModel} from './priorities/task-priority-model';

export interface TaskModel {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number;
  status: TaskStatusModel;
  priority: TaskPriorityModel;
  assignedTo: number;
  createdBy: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
