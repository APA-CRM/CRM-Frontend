import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {SelectModule} from 'primeng/select';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DividerModule} from 'primeng/divider';
import {TagModule} from 'primeng/tag';
import {CardModule} from 'primeng/card';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {TaskStatusModel} from '../../../../../models/tasks/statuses/task-status-model';
import {TaskPriorityModel} from '../../../../../models/tasks/priorities/task-priority-model';
import {DetailedTaskModel} from '../../../../../models/tasks/detailed-task-model';
import {TaskCompositeService} from '../../../../../core/services/composite/task-composite.service';
import {TaskPrioritiesService} from '../../../../../core/services/tasks/task-priorities.service';
import {TaskStatusesService} from '../../../../../core/services/tasks/task-statuses.service';
import {ErrorMessageModel} from '../../../../../models/error/error-message-model';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ColorService} from '../../../../../core/services/color.service';
import {PriorityStatusTagComponent} from '../priority-status-tag/priority-status-tag.component';
import {DatePickerModule} from 'primeng/datepicker';
import {SearchUserComponent} from '../../../user/search-user/search-user.component';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    DividerModule,
    TagModule,
    CardModule,
    ConfirmPopupModule,
    PriorityStatusTagComponent,
    SearchUserComponent
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {

  @Input() task!: DetailedTaskModel;
  @Output() taskUpdated = new EventEmitter<DetailedTaskModel>();
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  taskForm!: FormGroup;

  taskStatuses: TaskStatusModel[] = [];
  taskPriorities: TaskPriorityModel[] = [];

  editing: boolean = false;
  saveLoading: boolean = false;
  deleteLoading: boolean = false;
  loadingData: boolean = false;
  copiedToClipboard: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskCompositeService: TaskCompositeService,
    private taskStatusesService: TaskStatusesService,
    private taskPrioritiesService: TaskPrioritiesService,
    private colorService: ColorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.populateForm();
  }

  initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      statusId: [null, Validators.required],
      priorityId: [null, Validators.required],
      assignedTo: [null, Validators.required],
      estimatedTime: [null],
      dueDate: [null]
    });

    this.taskForm.disable();
  }

  loadInitialData(): void {
    if (this.taskStatuses.length === 0 || this.taskPriorities.length === 0) {
      this.loadingData = true;
      this.getTaskStatuses();
      this.getTaskPriorities();
    }
  }

  populateForm(): void {
    this.taskForm.patchValue({
      title: this.task.title,
      description: this.task.description,
      statusId: this.task.status.id,
      priorityId: this.task.priority.id,
      assignedTo: this.task.assignedTo.id,
      estimatedTime: this.task.estimatedTime,
      dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null
    });
  }

  getTaskStatuses(): void {
    this.taskStatusesService.getOrganizationTaskStatuses().subscribe({
      next: (statuses) => {
        this.taskStatuses = statuses;
        this.checkLoadingComplete();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        this.loadingData = false;
      }
    });
  }

  getTaskPriorities(): void {
    this.taskPrioritiesService.getOrganizationTaskPriorities().subscribe({
      next: (priorities) => {
        this.taskPriorities = priorities;
        this.checkLoadingComplete();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        this.loadingData = false;
      }
    });
  }

  enableEdit(): void {
    this.editing = true;
    this.taskForm.enable();
  }

  cancelEdit(): void {
    this.editing = false;
    this.taskForm.disable();
    this.populateForm();
  }

  copyTaskLinkToClipboard(): void {
    const taskLink = this.getTaskLink();
    navigator.clipboard.writeText(taskLink).then(() => {
      this.copiedToClipboard = true;
      this.messageService.add({
        closable: true,
        summary: 'Task link copied to clipboard',
        severity: 'success'
      });
      setTimeout(() => {
        this.copiedToClipboard = false;
      }, 2000);
    }).catch(() => {
      this.messageService.add({
        closable: true,
        summary: 'Failed to copy link',
        severity: 'error'
      });
    });
  }

  getTaskLink(): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/tasks/${this.task.id}`;
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.messageService.add({
        closable: true,
        summary: 'Please fill in all required fields',
        severity: 'warning'
      });
      return;
    }

    this.saveLoading = true;

    const request = {
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value || null,
      statusId: this.taskForm.get('statusId')?.value,
      priorityId: this.taskForm.get('priorityId')?.value,
      assignedTo: this.taskForm.get('assignedTo')?.value,
      estimatedTime: this.taskForm.get('estimatedTime')?.value || null,
      dueDate: this.taskForm.get('dueDate')?.value || null
    };

    this.taskCompositeService.updateTask(this.task.id, request).subscribe({
      next: (updatedTask) => {
        this.saveLoading = false;
        this.task = updatedTask;
        this.editing = false;
        this.taskForm.disable();
        this.taskUpdated.emit(updatedTask);
        this.messageService.add({
          closable: true,
          summary: 'Task updated successfully',
          severity: 'success'
        });
      },
      error: (err) => {
        this.saveLoading = false;
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    });
  }

  confirmDelete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this task?',
      icon: 'pi pi-exclamation-triangle',
      header: 'Confirm Deletion',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete'
      },
      accept: () => {
        this.deleteTask();
      }
    });
  }

  deleteTask(): void {
    this.deleteLoading = true;

    this.taskCompositeService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.taskDeleted.emit(this.task.id);
        this.messageService.add({
          closable: true,
          summary: 'Task deleted successfully',
          severity: 'success'
        });
      },
      error: (err) => {
        this.deleteLoading = false;
        const error: ErrorMessageModel = err.error;
        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    });
  }

  closePanel(): void {
    this.close.emit();
  }

  isInvalidForm(): boolean {
    return this.taskForm.invalid;
  }

  getContrastColor(color: string): string {
    return this.colorService.getContrastTextColor(color);
  }

  private checkLoadingComplete(): void {
    if (this.taskStatuses.length > 0 && this.taskPriorities.length > 0) {
      this.loadingData = false;
    }
  }

}
