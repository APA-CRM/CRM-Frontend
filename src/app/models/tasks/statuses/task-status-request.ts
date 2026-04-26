import {TaskStatusType} from '../../../core/enums/task-status-type';

export interface TaskStatusRequest {
  name: string;
  color: string;
  type: TaskStatusType
}
