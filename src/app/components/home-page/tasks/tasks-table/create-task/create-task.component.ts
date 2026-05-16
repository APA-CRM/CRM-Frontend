import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DetailedTaskModel} from '../../../../../models/tasks/detailed-task-model';
import {TaskStatusesService} from '../../../../../core/services/tasks/task-statuses.service';
import {TaskPrioritiesService} from '../../../../../core/services/tasks/task-priorities.service';
import {TaskCompositeService} from '../../../../../core/services/composite/task-composite.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskStatusModel} from '../../../../../models/tasks/statuses/task-status-model';
import {ErrorMessageModel} from '../../../../../models/error/error-message-model';
import {MessageService} from 'primeng/api';
import {TaskPriorityModel} from '../../../../../models/tasks/priorities/task-priority-model';
import {SelectFilterEvent, SelectModule} from 'primeng/select';
import {TextareaModule} from 'primeng/textarea';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {UserService} from '../../../../../core/services/user.service';
import {UserModel} from '../../../../../models/users/user-model';
import {DialogModule} from 'primeng/dialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputNumberModule} from 'primeng/inputnumber';
import {DatePickerModule} from 'primeng/datepicker';
import {TagModule} from 'primeng/tag';
import {PriorityStatusTagComponent} from '../priority-status-tag/priority-status-tag.component';

@Component({
  selector: 'app-create-task',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    ProgressSpinnerModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    TagModule,
    PriorityStatusTagComponent
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {

  @Output() onTaskCreated = new EventEmitter<DetailedTaskModel>();

  taskForm: FormGroup;

  taskStatuses: TaskStatusModel[] = [];
  taskPriorities: TaskPriorityModel[] = [];
  assignedUsers: UserModel[] = [];
  filteredAssignedUsers: UserModel[] = [];

  displayDialog: boolean = false;
  saveLoading: boolean = false;
  loadingData: boolean = false;
  loadingUsers: boolean = false;

  private timerId: number | undefined;

  constructor(
    private taskCompositeService: TaskCompositeService,
    private taskPrioritiesService: TaskPrioritiesService,
    private taskStatusesService: TaskStatusesService,
    private userService: UserService,
    private messageService: MessageService,
    formBuilder: FormBuilder
  ) {
    this.taskForm = formBuilder.group({
      "title": ['', Validators.required],
      "description": null,
      "estimatedTime": null,
      "statusId": [null, Validators.required],
      "priorityId": [null, Validators.required],
      "assignedTo": [null, Validators.required],
      "dueDate": null
    })
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  openDialog(): void {
    this.displayDialog = true;
    this.loadInitialData();
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  loadInitialData(): void {
    if (this.taskStatuses.length === 0 || this.taskPriorities.length === 0) {
      this.loadingData = true;
      this.getTaskStatuses();
      this.getTaskPriorities();
    }
  }

  public getTaskStatuses(): void {
    this.taskStatusesService.getOrganizationTaskStatuses().subscribe({
      next: taskStatuses => {
        this.taskStatuses = taskStatuses;
        this.checkLoadingComplete();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        this.loadingData = false;
      }
    })
  }

  public getTaskPriorities(): void {
    this.taskPrioritiesService.getOrganizationTaskPriorities().subscribe({
      next: taskPriorities => {
        this.taskPriorities = taskPriorities;
        this.checkLoadingComplete();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        this.loadingData = false;
      }
    })
  }

  onFilterUsers($event: SelectFilterEvent): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = window.setTimeout(() => this.findUsersByFullName($event.filter), 500);
  }

  findUsersByFullName(value: string): void {
    if (!value) {
      this.filteredAssignedUsers = this.assignedUsers;
      return;
    }

    this.loadingUsers = true;

    this.userService.getUsersByFullName(value).subscribe({
      next: (users) => {
        this.filteredAssignedUsers = users;
        this.assignedUsers = users;
        this.loadingUsers = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        this.loadingUsers = false;
      }
    });
  }

  public createTask(): void {
    if (this.taskForm.invalid) {
      this.messageService.add({
        closable: true,
        summary: 'Please fill in all required fields',
        severity: 'warning'
      });
      return;
    }

    this.saveLoading = true;

    this.taskCompositeService.createTask(this.taskForm.value).subscribe({
      next: createdTask => {
        this.saveLoading = false;
        this.onTaskCreated.emit(createdTask);
        this.messageService.add({
          closable: true,
          summary: 'Task created successfully',
          severity: 'success'
        });
        this.closeDialog();
        this.resetForm();
      },
      error: (err) => {
        this.saveLoading = false;
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  isInvalidForm(): boolean {
    return this.taskForm.invalid;
  }

  private checkLoadingComplete(): void {
    if (this.taskStatuses.length > 0 && this.taskPriorities.length > 0) {
      this.loadingData = false;
    }
  }

  private resetForm(): void {
    this.taskForm.reset({
      statusId: null,
      priorityId: null,
      assignedTo: null
    });
    this.filteredAssignedUsers = [];
  }

}
