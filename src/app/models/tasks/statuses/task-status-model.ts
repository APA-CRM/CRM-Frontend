import {TaskStatusType} from '../../../core/enums/task-status-type';

export interface TaskStatusModel {
  id: number;
  name: string;
  color: string;
  type: TaskStatusType;
  createdAt: Date;
  updatedAt: Date;
}
