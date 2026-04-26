export interface TaskRequest {
  title: string;
  description?: string;
  estimatedTime?: number;
  statusId: number;
  priorityId: number;
  assignedTo: number;
  dueDate?: Date;
}
