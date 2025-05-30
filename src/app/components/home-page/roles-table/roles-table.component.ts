import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrganizationHolderService } from '../../../core/services/organization-holder.service';
import { OrganizationRolesService } from '../../../core/services/organization-roles.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { RoleFilterRequest } from '../../../models/roles/role-filter-request';
import { SortDirection } from '../../../core/enums/sort-direction';
import { RoleModel } from '../../../models/roles/role-model';
import { Page } from '../../../models/page/page';
import { ErrorMessageModel } from '../../../models/error/error-message-model';
import { TagModule } from 'primeng/tag';
import { RoleRequest } from '../../../models/roles/create-role-request';
import { FormsModule } from '@angular/forms';
import { AccessControlService } from '../../../core/services/access-control.service';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'app-roles-table',
  imports: [
    TableModule,
    PaginatorModule,
    TagModule,
    InputTextModule,
    MultiSelect,
    DrawerModule,
    ButtonModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.css'
})
export class RolesTableComponent implements OnInit, OnChanges {

  @Input()
  searchRoleName!: string | null;

  @Input()
  refreshTrigger: boolean = false;

  roles: RoleModel[] = [];

  updatedRole: RoleRequest = {
    name: "",
    resources: []
  };

  updatedRowId = 0;

  loading: boolean = true;

  availableResources: string[] = [];

  availableActions: string[] = [];

  selectedActionsPerResource: { [resource: string]: string[] } = {};

  isAllResourceSelected: boolean = false;

  showSidebar: boolean = false;

  page: Page = {
    number: 0,
    totalPages: 0,
    size: 0,
    totalElements: 0
  }

  request: RoleFilterRequest = {
    name: null,
    page: 0,
    size: 10,
    sortDirection: SortDirection.ASC,
    sortBy: 'name'
  };

  constructor(
    private organizationHolder: OrganizationHolderService,
    private organizationRolesService: OrganizationRolesService,
    private accessControlService: AccessControlService,
    private messageService: MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.request.name = this.searchRoleName;

    this.fetchRoles();
  }

  ngOnInit(): void {
    this.fetchRoles()
    this.fetchResourcesAndActions();
  }

  fetchRoles(): void {

    this.loading = true;

    this.organizationRolesService.filterOrganizationRoles(
      this.request, this.organizationHolder.getOrganizationId()
    ).subscribe({
      next: (value) => {
        this.roles = value.content;
        this.page = value.page;

        this.loading = false
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    })
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
        this.availableResources = value;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    });
  }

  onPageChanged($event: PaginatorState) {
    this.request.page = $event.page!

    this.fetchRoles();
  }

  onUpdateRow(role: RoleModel) {
    if (role.id === this.updatedRowId) {
      this.updatedRowId = 0;
    } else {
      this.isAllResourceSelected = false;
      this.updatedRowId = role.id;
      this.updatedRole.name = role.name;
      this.selectedActionsPerResource = {}

      for (const ac of role.accessControls) {
        this.selectedActionsPerResource[ac.resource] = ac.actions;
      }
    }
  }

  openSidebar(role: RoleModel): void {
    this.isAllResourceSelected = false;
    this.updatedRowId = role.id;
    this.updatedRole.name = role.name;
    this.selectedActionsPerResource = {};

    for (const ac of role.accessControls) {
      if(ac.resource === 'All' && ac.actions.length > 0) {
        this.isAllResourceSelected = true;
      }

      this.selectedActionsPerResource[ac.resource] = [...ac.actions];
    }

    this.showSidebar = true;
  }

  cancelEdit(): void {
    this.updatedRowId = 0;
    this.showSidebar = false;
  }

  updateRole(): void {
    const permissions = Object.entries(this.selectedActionsPerResource)
      .filter(([_, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource,
        actions,
      }));

    this.updatedRole.resources = permissions;

    this.organizationRolesService.updateOrganizationRole(
      this.updatedRole, this.organizationHolder.getOrganizationId(),
      this.updatedRowId
    ).subscribe({
      next: (role) => {
        this.updateRoleInTable(role);

        this.messageService.add({closable: true, summary: `Role is updated`, severity: 'success'});
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    })

    this.cancelEdit();
  }

  
  disableResourceIfNotAll(resource: string) {
    return resource !== 'All' && this.isAllResourceSelected;
  }
  
  onActionChange(resource: string) {
    if (resource === 'All' && this.selectedActionsPerResource[resource].length > 0) {
      this.isAllResourceSelected = true;
    } else {
      this.isAllResourceSelected = false;
    }
  }

  private updateRoleInTable(newRole: RoleModel) {
    var index = this.roles.findIndex(r => r.id === newRole.id);

    this.roles[index] = newRole;
  }

}