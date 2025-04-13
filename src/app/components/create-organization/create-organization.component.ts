import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { OrganizationCreate } from '../../core/models/organization-create';
import { OrganizationServiceService as OrganizationService } from '../../core/services/organization.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorMessage } from '../../core/models/error-message';

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
    { name: 'name', label: 'Name', icon: 'pi-users'},
    { name: 'email', label: 'Email', type: 'email', icon: 'pi-envelope'},
    { name: 'address', label: 'Address', icon: 'pi-building'},
    { name: 'city', label: 'City', icon: 'pi-building'},
    { name: 'country', label: 'Country', icon: 'pi-building'}
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private messageService: MessageService,
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
      const orgData: OrganizationCreate = this.organizationForm.value;
      this.organizationService.createOrganization(orgData)
      .subscribe({
        next: () => this.router.navigate(['']),
        error: err => {
          const error: ErrorMessage = err.error; 
          
          this.messageService.add({closable: true, summary: error.message, severity: 'error'})
        }
      });
    }
  }
}
