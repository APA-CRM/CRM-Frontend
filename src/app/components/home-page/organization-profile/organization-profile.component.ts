import {Component, OnInit} from '@angular/core';
import {OrganizationService} from '../../../core/services/organizations/organization.service';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SkeletonModule} from 'primeng/skeleton';
import {ButtonModule} from 'primeng/button';
import {OrganizationModel} from '../../../models/organizations/organization-model';
import {AvatarModule} from 'primeng/avatar';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {OrganizationRequest} from '../../../models/organizations/organization-request';
import {OrganizationHolderService} from '../../../core/services/organizations/organization-holder.service';

@Component({
  selector: 'app-organization-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonModule,
    ButtonModule,
    AvatarModule,
    DialogModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './organization-profile.component.html',
  styleUrl: './organization-profile.component.css'
})
export class OrganizationProfileComponent implements OnInit {

  canEdit: boolean = false;

  editing: boolean = false;

  organizationId: number = 0;

  organization: OrganizationModel | null = null;

  organizationForm: FormGroup;

  constructor(
    private organizationService: OrganizationService,
    private organizationHolder: OrganizationHolderService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.organizationForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      address: '',
      city: '',
      country: '',
      description: ''
    })
  }

  get visibleFieldCount(): number {
    const org = this.organization
    if (!org) return 0

    return [
      org.email,
      org.address,
      org.city,
      org.country,
      org.description
    ].filter(Boolean).length
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('organizationId');

    this.organizationId = Number(id);

    this.canEdit = this.organizationHolder.isUserInOrganization(this.organizationId);

    this.organizationService.getOrganization(this.organizationId).subscribe({
      next: data => {
        this.organization = data;
        this.organizationForm.patchValue(this.organization)
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  // TODO: Move this method to separate service
  getLabelForAvatar(name: string): string {
    if (name) {
      return name.charAt(0).toUpperCase();
    }

    return 'C';
  }

  openEditDialog(): void {
    this.editing = true;
  }

  isInvalid(controlName: string): boolean {
    const control = this.organizationForm.get(controlName)
    return !!(control && control.invalid && (control.dirty || control.touched))
  }

  onSubmit() {
    if (this.organizationForm.valid) {
      const request: OrganizationRequest = this.organizationForm.value

      this.organizationService.updateOrganization(this.organizationId, request)
        .subscribe({
          next: data => {
            this.organization = data;
            this.organizationForm.patchValue(this.organization)
            this.editing = false;

            this.messageService.add({
              closable: true,
              summary: `${data.name} organization has been updated`,
              severity: 'success'
            });
          },
          error: (err) => {
            const error: ErrorMessageModel = err.error;

            this.messageService.add({closable: true, summary: error.message, severity: 'error'});
          }
        })
    } else {
      this.organizationForm.markAllAsTouched()
    }
  }

}
