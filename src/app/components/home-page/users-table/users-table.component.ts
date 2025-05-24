import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserWithRolesModel } from '../../../models/user-with-roles-model';
import { CommonModule } from '@angular/common';
import { UsersFilterRequest } from '../../../models/users-filter-request';
import { SortDirection } from '../../../core/enums/sort-direction';
import { OrganizationHolderService } from '../../../core/services/organization-holder.service';
import { TagModule } from 'primeng/tag';
import { MessageService, SortEvent } from 'primeng/api';
import { ErrorMessageModel } from '../../../models/error/error-message-model';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectFilterEvent, SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { OrganizationUsersService } from '../../../core/services/organization-users.service';
import { OrganizationRolesService } from '../../../core/services/organization-roles.service';
import { RoleModel } from '../../../models/role-model';
import { UserModel } from '../../../models/user-model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-users-table',
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    PaginatorModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {
  users: UserWithRolesModel[] = [];

  roles: RoleModel[] = [];

  loading: boolean = true;

  usersToAdd: UserModel[] = [];

  selectedUser: UserModel | null = null;

  totalElements: number = 0;

  size: number = 10

  first: number = 0;

  filter!: UsersFilterRequest;

  @ViewChild('userTable') userTable!: Table;

  constructor(
    private organizationHolder: OrganizationHolderService,
    private organizationUserService: OrganizationUsersService,
    private organizationRolesService: OrganizationRolesService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.filter = this.defaultValueOfFilter();
  }

  private defaultValueOfFilter(): UsersFilterRequest {
    return {
      page: 0,
      size: 10,
      sortDirection: SortDirection.ASC,
      sortBy: null,
      login: null,
      email: null,
      firstName: null,
      lastName: null,
      createdDate: null,
      updatedDate: null,
      rolesId: []
    };
  }

  resetFilter(): void {
    this.filter = this.defaultValueOfFilter();

    this.userTable.reset()

    this.fetchUsers();
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchOrganizationRoles();
  }

  onPageChanged(event: PaginatorState) {
    this.filter.page = event.page!;

    this.fetchUsers();
  }

  findUsersToAddToOrganization($event: SelectFilterEvent) {
    this.userService.getUsersByLogin($event.filter)
    .subscribe({
      next: (value) => this.usersToAdd = value,
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    });
  }

  addUserToOrganization(): void{
    this.organizationUserService.addUserToOrganization(
      this.organizationHolder.getOrganizationId(),
      this.selectedUser!.id
    ).subscribe({
      next: (user) => {
        this.messageService.add({closable: true, summary: `${user.fullName} added to organization`, severity: 'success'});
        this.fetchUsers();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    })
  }

  fetchUsers(): void {
    this.loading = true;

    this.organizationUserService.getFilterUsers(
      this.filter, 
      this.organizationHolder.getOrganizationId()
    ).subscribe({
      next: (value) => {
        this.loading = false;

        this.totalElements = value.page.totalElements;

        this.size = value.page.size;

        this.first = value.page.number;

        this.users = value.content;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    });

  }

  fetchOrganizationRoles(): void {
    this.organizationRolesService.getOrganizationUsers(
      this.organizationHolder.getOrganizationId()
    ).subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error' });
      }
    })
  }

  applyFilter() {
    this.filter.page = 0;
    this.fetchUsers();
  }

  onSort(event: SortEvent): void {
    this.filter.sortBy = event.field!;
    this.filter.sortDirection = event.order === 1 ? SortDirection.ASC : SortDirection.DESC;
  }

}
