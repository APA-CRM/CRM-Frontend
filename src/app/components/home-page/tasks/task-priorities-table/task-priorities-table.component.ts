import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {TaskPriorityModel} from '../../../../models/tasks/priorities/task-priority-model';
import {TaskPrioritiesService} from '../../../../core/services/tasks/task-priorities.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../../models/error/error-message-model';
import {SkeletonModule} from 'primeng/skeleton';
import {DatePipe} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TaskPriorityRequest} from '../../../../models/tasks/priorities/task-priority-request';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-task-priorities-table',
  imports: [
    TableModule,
    InputTextModule,
    SkeletonModule,
    ButtonModule,
    ColorPickerModule,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './task-priorities-table.component.html',
  styleUrl: './task-priorities-table.component.css'
})
export class TaskPrioritiesTableComponent implements OnInit {

  priorities: TaskPriorityModel[] = []

  isLoading = false;
  isCreateLoading = false;
  isUpdateLoading = false;
  isDeleteLoading = false;

  createForm!: FormGroup;
  editingForm!: FormGroup;

  editPriorityModel: TaskPriorityModel | null = null;

  skeleton: any = [{}, {}, {}, {}, {}, {}, {}, {}];

  constructor(
    private readonly prioritiesService: TaskPrioritiesService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.createForm = this.initFormGroup();
    this.editingForm = this.initFormGroup();
  }

  ngOnInit() {
    this.fetchTaskPriorities();
  }

  fetchTaskPriorities() {
    this.isLoading = true;
    this.prioritiesService.getOrganizationTaskPriorities().subscribe({
      next: taskPriorities => {
        this.priorities = taskPriorities;

        this.isLoading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  editPriority(priority: TaskPriorityModel) {
    this.editingForm.setValue({"name": priority.name, "color": priority.color});

    this.editPriorityModel = priority;
  }

  createPriority(): void {
    if (this.priorities[0]?.id === -1) {
      return;
    }

    this.priorities.unshift({
      id: -1,
      name: null!,
      color: null!,
      createdAt: null!,
      updatedAt: null!
    })
  }

  cancelCreating(): void {
    this.priorities.shift();

    this.resetFormGroup(this.createForm);
  }

  confirmCreating(): void {
    if (this.createForm.invalid) {
      return;
    }

    const request: TaskPriorityRequest = this.createForm.value;

    this.isCreateLoading = true;
    this.prioritiesService.createTaskPriority(request).subscribe({
      next: priority => {
        this.priorities[0] = priority
        this.resetFormGroup(this.createForm);

        this.isCreateLoading = false;
        this.messageService.add({
          closable: true,
          summary: 'Task priority created successfully',
          severity: 'success'
        })
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.isCreateLoading = false;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  confirmEditing(): void {
    if (this.editingForm.invalid) {
      return;
    }

    const request: TaskPriorityRequest = this.editingForm.value;

    this.isUpdateLoading = true;
    this.prioritiesService.updateTaskPriority(this.editPriorityModel?.id!, request).subscribe({
      next: updatedPriority => {
        const index = this.priorities.findIndex(priority => priority.id === updatedPriority.id);

        this.cancelEditing();
        this.priorities[index] = updatedPriority;
        this.isUpdateLoading = false;

        this.messageService.add({
          closable: true,
          summary: 'Task priority updated successfully',
          severity: 'success'
        });
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.isUpdateLoading = false;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  confirmDeletionOfPriority(priority: TaskPriorityModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this task priority from the organization?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.deletePriority(priority);
      }
    });
  }

  cancelEditing(): void {
    this.editPriorityModel = null;
  }

  private deletePriority(priority: TaskPriorityModel): void {
    this.isDeleteLoading = true;
    this.prioritiesService.deleteTaskPriority(priority.id).subscribe({
      next: () => {
        const index = this.priorities.findIndex(value => value.id === priority.id);

        this.priorities.splice(index, 1);
        this.isDeleteLoading = false;

        this.messageService.add({
          closable: true,
          summary: 'Task priority deleted successfully',
          severity: 'success'
        });
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;
        this.isDeleteLoading = false;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  private initFormGroup() {
    return this.formBuilder.group({
      name: [null, Validators.required],
      color: ['#4fdc0e', Validators.required]
    })
  }

  private resetFormGroup(formGroup: FormGroup): void {
    formGroup.reset({
      name: null,
      color: '#4fdc0e'
    });
  }
}
