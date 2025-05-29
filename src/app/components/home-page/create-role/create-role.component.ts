import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { AccessControlService } from '../../../core/services/access-control.service';
import { MessageService } from 'primeng/api';
import { ErrorMessageModel } from '../../../models/error/error-message-model';
import { CreateRoleRequest } from '../../../models/roles/create-role-request';
import { OrganizationRolesService } from '../../../core/services/organization-roles.service';
import { OrganizationHolderService } from '../../../core/services/organization-holder.service';

@Component({
  selector: 'app-create-role',
  imports: [
    MultiSelect,
    ButtonModule,
    InputText,
    PopoverModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent{

  @Output()
  roleCreated: EventEmitter<void> = new EventEmitter<void>();

  roleName: string = '';

  resources: string[] = [];

  availableActions: string[] = [];

  isAllResourceSelected:boolean = false;

  selectedActionsPerResource: { [resource: string]: string[] } = {};

  constructor(
    private accessControlService: AccessControlService,
    private organizationHolder: OrganizationHolderService,
    private organizationRoleService: OrganizationRolesService,
    private messageService: MessageService
  ) {
    this.fetchResourcesAndActions();
  }

  private fetchResourcesAndActions() {
    this.accessControlService.getAllActions().subscribe({
      next: value => {
        this.availableActions = value;

        this.availableActions.map(a => ({ label: a, value: a }))
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    });

    this.accessControlService.getAllResources().subscribe({
      next: value => {
        this.resources = value;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    });
  }


  disableResourceIfNotAll(resource: string) {
    return resource !== 'All' && this.isAllResourceSelected;
  }

  onActionChange(resource: string) {
    if(resource === 'All' && this.selectedActionsPerResource[resource].length > 0) {
      this.isAllResourceSelected = true;
    } else {
      this.isAllResourceSelected = false;
    }
  }

  onSubmit() {
    const permissions = Object.entries(this.selectedActionsPerResource)
      .filter(([_, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource,
        actions,
      }));

    const role: CreateRoleRequest = {
      name: this.roleName,
      resources: permissions,
    };

    this.organizationRoleService.createRoleForOrgnization(
      role, 
      this.organizationHolder.getOrganizationId()
    ).subscribe({
      next: role => {
        this.roleCreated.emit();
        
        this.messageService.add({closable: true, summary: `${role.name} created`, severity: 'success'});
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    })
  }
}