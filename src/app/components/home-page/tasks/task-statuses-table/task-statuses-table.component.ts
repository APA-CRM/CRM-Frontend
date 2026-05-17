import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {ColorPickerModule} from "primeng/colorpicker";
import {InputTextModule} from 'primeng/inputtext';
import {SkeletonModule} from "primeng/skeleton";
import {TableModule} from "primeng/table";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {TaskStatusModel} from '../../../../models/tasks/statuses/task-status-model';
import {TaskStatusType} from '../../../../core/enums/task-status-type';
import {TaskStatusesService} from '../../../../core/services/tasks/task-statuses.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../../models/error/error-message-model';
import {TaskStatusRequest} from '../../../../models/tasks/statuses/task-status-request';

@Component({
  selector: 'app-tasks-statuses-table',
  standalone: true,
  imports: [
    TableModule,
    InputTextModule,
    SkeletonModule,
    ButtonModule,
    ColorPickerModule,
    DatePipe,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './task-statuses-table.component.html',
  styleUrl: './task-statuses-table.component.css'
})
export class TasksStatusesTableComponent implements OnInit {

  statuses: TaskStatusModel[] = [];

  isLoading = false;
  isCreateLoading = false;
  isUpdateLoading = false;
  isDeleteLoading = false;

  createForm!: FormGroup;
  editingForm!: FormGroup;

  editStatusModel: TaskStatusModel | null = null;

  skeleton: any = [{}, {}, {}, {}, {}, {}, {}, {}];

  statusTypes = [
    {label: 'To Do', value: TaskStatusType.TODO},
    {label: 'In Progress', value: TaskStatusType.IN_PROGRESS},
    {label: 'Done', value: TaskStatusType.DONE},
    {label: 'Blocked', value: TaskStatusType.BLOCKED},
    {label: 'Canceled', value: TaskStatusType.CANCELED},
  ];

  constructor(
    private readonly statusesService: TaskStatusesService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.createForm = this.initFormGroup();
    this.editingForm = this.initFormGroup();
  }

  ngOnInit(): void {
    this.fetchTaskStatuses();
  }

  fetchTaskStatuses(): void {
    this.isLoading = true;

    this.statusesService.getOrganizationTaskStatuses().subscribe({
      next: statuses => {
        this.statuses = statuses;
        this.isLoading = false;
      },
      error: err => {
        const error: ErrorMessageModel = err.error;

        this.isLoading = false;

        this.messageService.add({
          closable: true,
          summary: error.message,
          severity: 'error'
        });
      }
    });
  }

  editStatus(status: TaskStatusModel): void {
    this.editingForm.setValue({
      name: status.name,
      color: status.color,
      type: status.type
    });

    this.editStatusModel = status;
  }

  cancelEditing(): void {
    this.editStatusModel = null;
  }

  createStatus(): void {
    if (this.statuses[0]?.id === -1) {
      return;
    }

    this.statuses.unshift({
      id: -1,
      name: null!,
      color: null!,
      type: null!,
      createdAt: null!,
      updatedAt: null!,
    });
  }

  cancelCreating(): void {
    this.statuses.shift();
    this.resetFormGroup(this.createForm);
  }

  confirmCreating(): void {
    if (this.createForm.invalid) {
      return;
    }

    const request: TaskStatusRequest = this.createForm.value;

    this.isCreateLoading = true;

    this.statusesService.createTaskStatus(request).subscribe({
      next: status => {
        this.statuses[0] = status;

        this.resetFormGroup(this.createForm);
        this.isCreateLoading = false;

        this.messageService.add({
          closable: true,
          summary: 'Task status created successfully',
          severity: 'success'
        });
      },
      error: err => {
        const error: ErrorMessageModel = err.error;

        this.isCreateLoading = false;

        this.messageService.add({
          closable: true,
          summary: error.message,
          severity: 'error'
        });
      }
    });
  }

  confirmEditing(): void {
    if (this.editingForm.invalid) {
      return;
    }

    const request: TaskStatusRequest = this.editingForm.value;

    this.isUpdateLoading = true;

    this.statusesService.updateTaskStatus(this.editStatusModel?.id!, request).subscribe({
      next: updatedStatus => {
        const index = this.statuses.findIndex(status => status.id === updatedStatus.id);

        this.statuses[index] = updatedStatus;

        this.cancelEditing();

        this.isUpdateLoading = false;

        this.messageService.add({
          closable: true,
          summary: 'Task status updated successfully',
          severity: 'success'
        });
      },
      error: err => {
        const error: ErrorMessageModel = err.error;

        this.isUpdateLoading = false;

        this.messageService.add({
          closable: true,
          summary: error.message,
          severity: 'error'
        });
      }
    });
  }

  confirmDeletionOfStatus(status: TaskStatusModel): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this task status from the organization?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.deleteStatus(status);
      }
    });
  }

  getTypeSeverity(type: TaskStatusType): string {
    switch (type) {
      case TaskStatusType.TODO:
        return 'bg-gray-100 text-gray-700';

      case TaskStatusType.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700';

      case TaskStatusType.DONE:
        return 'bg-green-100 text-green-700';

      case TaskStatusType.BLOCKED:
        return 'bg-orange-100 text-orange-700';

      case TaskStatusType.CANCELED:
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getTypeLabel(type: TaskStatusType): string {
    for (let statusType of this.statusTypes) {
      if (statusType.value === type) {
        return statusType.label;
      }
    }

    return type;
  }

  private deleteStatus(status: TaskStatusModel): void {
    this.isDeleteLoading = true;

    this.statusesService.deleteTaskStatus(status.id).subscribe({
      next: () => {
        const index = this.statuses.findIndex(value => value.id === status.id);

        this.statuses.splice(index, 1);

        this.isDeleteLoading = false;

        this.messageService.add({
          closable: true,
          summary: 'Task status deleted successfully',
          severity: 'success'
        });
      },
      error: err => {
        const error: ErrorMessageModel = err.error;

        this.isDeleteLoading = false;

        this.messageService.add({
          closable: true,
          summary: error.message,
          severity: 'error'
        });
      }
    });
  }

  private initFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      color: ['#4fdc0e', Validators.required],
      type: [null, Validators.required],
    });
  }

  private resetFormGroup(formGroup: FormGroup): void {
    formGroup.reset({
      name: null,
      color: '#4fdc0e',
      type: null
    });
  }
}
