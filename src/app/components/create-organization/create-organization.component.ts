import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {FloatLabelModule} from 'primeng/floatlabel';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {OrganizationRequest} from '../../models/organizations/organization-request';
import {OrganizationService as OrganizationService} from '../../core/services/organizations/organization.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../models/error/error-message-model';
import {OrganizationHolderService} from '../../core/services/organizations/organization-holder.service';

@Component({
  selector: 'app-create-organization',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent {
  organizationForm: FormGroup;

  fields = [
    {name: 'name', label: 'Name', icon: 'pi-users'},
    {name: 'email', label: 'Email', type: 'email', icon: 'pi-envelope'},
    {name: 'address', label: 'Address', icon: 'pi-building'},
    {name: 'city', label: 'City', icon: 'pi-building'},
    {name: 'country', label: 'Country', icon: 'pi-building'}
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private messageService: MessageService,
    private organizationHolderService: OrganizationHolderService,
    private router: Router
  ) {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      city: [''],
      country: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isInvalidField(field: string): boolean | null {
    const control = this.organizationForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.organizationForm.valid) {
      const orgData: OrganizationRequest = this.organizationForm.value;
      this.organizationService.createOrganization(orgData)
        .subscribe({
          next: (data) => {
            this.router.navigate(['']);
            this.organizationHolderService.setCurrentOrganization(data.id, data.name);
          },
          error: err => {
            const error: ErrorMessageModel = err.error;

            this.messageService.add({closable: true, summary: error.message, severity: 'error'})
          }
        });
    }
  }
}
