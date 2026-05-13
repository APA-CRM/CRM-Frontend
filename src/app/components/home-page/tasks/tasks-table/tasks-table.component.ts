import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskStatusesService} from '../../../../core/services/tasks/task-statuses.service';
import {TaskPrioritiesService} from '../../../../core/services/tasks/task-priorities.service';
import {TaskFilterRequest} from '../../../../models/tasks/task-filter-request';
import {SortDirection} from '../../../../core/enums/sort-direction';
import {Table, TableModule} from 'primeng/table';
import {MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../../models/error/error-message-model';
import {ButtonDirective, ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PopoverModule} from 'primeng/popover';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'primeng/select';
import {TaskStatusModel} from '../../../../models/tasks/statuses/task-status-model';
import {TaskPriorityModel} from '../../../../models/tasks/priorities/task-priority-model';
import {Skeleton} from 'primeng/skeleton';
import {TaskCompositeService} from '../../../../core/services/composite/task-composite.service';
import {DetailedTaskModel} from '../../../../models/tasks/detailed-task-model';
import {TagModule} from 'primeng/tag';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {DatePipe} from '@angular/common';
import {CreateTaskComponent} from '../create-task/create-task.component';

@Component({
  selector: 'app-tasks-table',
  imports: [
    ButtonDirective,
    InputTextModule,
    ButtonModule,
    PopoverModule,
    ReactiveFormsModule,
    SelectModule,
    FormsModule,
    TagModule,
    PaginatorModule,
    Skeleton,
    TableModule,
    DatePipe,
    CreateTaskComponent
  ],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.css'
})
export class TasksTableComponent implements OnInit {

  tasks: DetailedTaskModel[] = [];
  taskStatuses: TaskStatusModel[] = [];
  taskPriorities: TaskPriorityModel[] = [];

  filter: TaskFilterRequest;

  loading: boolean = true;
  skeleton: any;

  totalElements: number = 0;
  size: number = 10
  first: number = 0;

  @ViewChild('tasksTable') tasksTable!: Table;

  constructor(
    private taskCompositeService: TaskCompositeService,
    private taskStatusesService: TaskStatusesService,
    private taskPrioritiesService: TaskPrioritiesService,
    private messageService: MessageService
  ) {
    this.filter = this.getDefaultFilter();
  }

  ngOnInit(): void {
    this.fetchTasks();
    this.fetchTaskStatuses();
    this.fetchTaskPriorities();
  }

  fetchTasks(): void {
    this.loading = true;

    this.taskCompositeService.filterTasks(this.filter).subscribe({
      next: value => {
        this.tasks = value.content;

        this.totalElements = value.page.totalElements;
        this.size = value.page.size;
        this.first = value.page.number;

        this.loading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  fetchTaskStatuses(): void {
    this.taskStatusesService.getOrganizationTaskStatuses().subscribe({
      next: value => {
        this.taskStatuses = value;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  fetchTaskPriorities(): void {
    this.taskPrioritiesService.getOrganizationTaskPriorities().subscribe({
      next: value => {
        this.taskPriorities = value;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  onPageChanged(event: PaginatorState) {
    this.filter.page = event.page!;

    this.fetchTasks();
  }

  applyFilter() {
    this.filter.page = 0;
    this.fetchTasks();
  }

  resetFilter(): void {
    this.filter = this.getDefaultFilter();
    this.tasksTable.reset();
    this.fetchTasks();
  }

  addTaskToArray(task: DetailedTaskModel): void {
    this.tasks.push(task);
  }

  private getDefaultFilter(): TaskFilterRequest {
    return {
      page: 0,
      size: 10,
      sortDirection: SortDirection.ASC,
      sortBy: 'id'
    }
  }
}
