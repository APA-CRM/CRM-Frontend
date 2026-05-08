import {BaseFilterRequest} from '../filter/base-filter-request';
import {DateRange} from '../filter/date-range';

export interface TaskFilterRequest extends BaseFilterRequest {
  title?: string;
  statusId?: string;
  priorityId?: number;
  assignedTo?: number;
  createdBy?: number;
  dueDate?: DateRange;
  createdAt?: DateRange;
  updatedAt?: DateRange;
}
