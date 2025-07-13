import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OrganizationHolderService} from '../../../core/services/organization-holder.service';
import {OrganizationRolesService} from '../../../core/services/organization-roles.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {DrawerModule} from 'primeng/drawer';
import {ButtonModule} from 'primeng/button';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {CommonModule} from '@angular/common';
import {RoleFilterRequest} from '../../../models/roles/role-filter-request';
import {SortDirection} from '../../../core/enums/sort-direction';
import {RoleModel} from '../../../models/roles/role-model';
import {Page} from '../../../models/page/page';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {TagModule} from 'primeng/tag';
import {RoleRequest} from '../../../models/roles/create-role-request';
import {FormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {Action} from '../../../core/enums/action';
import {Resource} from '../../../core/enums/resource';
import {SkeletonModule} from 'primeng/skeleton';

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
    FormsModule,
    SkeletonModule
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

  skeleton: any;

  updatedRole: RoleRequest = {
    name: "",
    resources: []
  };

  updatedRowId = 0;

  loading: boolean = true;

  availableResources: Resource[] = Object.values(Resource);

  availableActions: Action[] = Object.values(Action);

  selectedActionsPerResource: { [resource: string]: string[] } = {};

  isAllResourceSelected: boolean = false;

  showSidebar: boolean = false;

  timerId: number | undefined;

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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.skeleton = Array.from({length: 8}).map((_, i) => `Item #${i}`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchRoleName'] && !changes['searchRoleName'].firstChange) {
      this.request.name = this.searchRoleName;
      this.fetchRolesByName();
    } else if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.fetchRoles();
    }
  }

  ngOnInit(): void {
    this.fetchRoles()
  }

  fetchRolesByName(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    // @ts-ignore
    this.timerId = setTimeout(() => this.fetchRoles(), 1000);
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

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  onPageChanged($event: PaginatorState) {
    this.request.page = $event.page!

    this.fetchRoles();
  }

  openSidebar(role: RoleModel): void {
    this.isAllResourceSelected = false;
    this.updatedRowId = role.id;
    this.updatedRole.name = role.name;
    this.selectedActionsPerResource = {};

    for (const ac of role.accessControls) {
      if (ac.resource === Resource.ALL && ac.actions.length > 0) {
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
    this.updatedRole.resources = Object.entries(this.selectedActionsPerResource)
      .filter(([_, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource,
        actions,
      }));

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

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })

    this.cancelEdit();
  }

  disableResourceIfNotAll(resource: Resource) {
    return resource !== Resource.ALL && this.isAllResourceSelected;
  }

  onActionChange(resource: Resource) {
    if (resource === Resource.ALL && this.selectedActionsPerResource[resource].length > 0) {
      this.isAllResourceSelected = true;
    } else {
      this.isAllResourceSelected = false;
    }
  }

  onDeleteRole(roleId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this role from the organization?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.removeRole(roleId);
      }
    });
  }

  removeRole(roleId: number): void {
    this.organizationRolesService.deleteOrganizationRole(
      this.organizationHolder.getOrganizationId(), roleId
    ).subscribe({
      next: (val) => {

        this.messageService.add({closable: true, summary: `Role removed from organization`, severity: 'success'});
        this.fetchRoles();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  private updateRoleInTable(newRole: RoleModel) {
    var index = this.roles.findIndex(r => r.id === newRole.id);

    this.roles[index] = newRole;
  }

}
