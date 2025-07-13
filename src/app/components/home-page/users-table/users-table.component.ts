import {Component, OnInit, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {UserWithRolesModel} from '../../../models/users/user-with-roles-model';
import {CommonModule} from '@angular/common';
import {UsersFilterRequest} from '../../../models/users/users-filter-request';
import {SortDirection} from '../../../core/enums/sort-direction';
import {OrganizationHolderService} from '../../../core/services/organization-holder.service';
import {TagModule} from 'primeng/tag';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {SelectFilterEvent, SelectModule} from 'primeng/select';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {PopoverModule} from 'primeng/popover';
import {OrganizationUsersService} from '../../../core/services/organization-users.service';
import {OrganizationRolesService} from '../../../core/services/organization-roles.service';
import {RoleModel} from '../../../models/roles/role-model';
import {UserModel} from '../../../models/users/user-model';
import {UserService} from '../../../core/services/user.service';
import {OrganizationUsersRolesService} from '../../../core/services/organization-users-roles.service';
import {OrganizationInvitationService} from '../../../core/services/organization-invitation.service';
import {Router} from '@angular/router';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-users-table',
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    ButtonModule,
    PaginatorModule,
    MultiSelectModule,
    PopoverModule,
    SelectModule,
    CommonModule,
    FormsModule,
    SkeletonModule
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {
  skeleton: any;

  users: UserWithRolesModel[] = [];

  roles: RoleModel[] = [];

  loading: boolean = true;

  usersToAdd: UserModel[] = [];

  selectedUser: UserModel | null = null;

  selectedRole: RoleModel | null = null;

  totalElements: number = 0;

  size: number = 10

  first: number = 0;

  filter!: UsersFilterRequest;

  @ViewChild('userTable') userTable!: Table;

  constructor(
    private organizationHolder: OrganizationHolderService,
    private organizationUserService: OrganizationUsersService,
    private organizationRolesService: OrganizationRolesService,
    private organizationUsersRolesService: OrganizationUsersRolesService,
    private userService: UserService,
    private invitationService: OrganizationInvitationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.skeleton = Array.from({length: 8}).map((_, i) => `Item #${i}`);
    this.filter = this.defaultValueOfFilter();
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
    this.userService.getUsersByFullName($event.filter)
      .subscribe({
        next: (value) => this.usersToAdd = value,
        error: (err) => {
          const error: ErrorMessageModel = err.error;

          this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        }
      });
  }

  addRoleToUser(userId: number, roleId: number): void {
    this.organizationUsersRolesService.addRoleForOrganizationUser(
      this.organizationHolder.getOrganizationId(), userId, roleId
    ).subscribe({
      next: value => {
        this.messageService.add({closable: true, summary: `Role has been assign to user`, severity: 'success'});
        this.fetchUsers();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  removeRoleFromUser(userId: number, roleId: number): void {
    this.organizationUsersRolesService.removeRoleForUserOrganization(
      this.organizationHolder.getOrganizationId(), userId, roleId
    ).subscribe({
      next: value => {
        this.messageService.add({closable: true, summary: `Role has been unassign for user`, severity: 'success'});
        this.fetchUsers();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  inviteUserToOrganization(): void {
    const roleId = this.selectedRole ? this.selectedRole.id : null;

    this.invitationService.createInvitation(
      this.organizationHolder.getOrganizationId(),
      this.selectedUser!.id,
      roleId
    ).subscribe({
      next: (data) => {
        this.messageService.add({
          closable: true,
          summary: `User has been invited to the organization`,
          severity: 'success'
        });
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
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

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    });

  }

  confirmDeletationOfUserFromOrganization(userId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this user from the organization?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.removeUser(userId);
      }
    });
  }

  removeUser(userId: number) {

    this.organizationUserService.removeUserFromOrganization(
      this.organizationHolder.getOrganizationId(), userId
    ).subscribe({
      next: () => {
        this.messageService.add({closable: true, summary: `User removed from organization`, severity: 'success'});
        this.fetchUsers();
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })

  }

  fetchOrganizationRoles(): void {
    this.organizationRolesService.getOrganizationUsers(
      this.organizationHolder.getOrganizationId()
    ).subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  applyFilter() {
    this.filter.page = 0;
    this.fetchUsers();
  }

  navigateToUserProfile(userId: number) {
    this.router.navigate([`user/${userId}`]);
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

}
