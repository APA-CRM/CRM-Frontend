import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PageModel } from '../../../models/page-model';
import { UserWithRolesModel } from '../../../models/user-with-roles-model';
import { CommonModule } from '@angular/common';
import { UsersFilterRequest } from '../../../models/users-filter-request';
import { SortDirection } from '../../../core/enums/sort-direction';
import { OrganizationHolderService } from '../../../core/services/organization-holder.service';
import { TagModule } from 'primeng/tag';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { ErrorMessageModel } from '../../../models/error-message-model';

@Component({
  selector: 'app-users-table',
  imports: [
    TableModule,
    TagModule,
    CommonModule
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit{

  users: UserWithRolesModel[] = [];

  loading: boolean = false;

  totalElements: number = 0; 

  size: number = 10

  filter: UsersFilterRequest;

  constructor(
    private organizationHolder: OrganizationHolderService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.filter = {
      page: 0,
      size: 10,
      sortDirection: SortDirection.ASC,
      sortBy: null,
      login: null,
      email: null,
      firstName: null,
      lastName: null,
      createDate: null,
      updatedDate: null,
      organizationId: organizationHolder.getOrganizationId()
    };
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  onLazeLoadUsers(event: any) {
    this.filter.page = event.first / event.rows;
    this.filter.size = event.rows;
    
    this.fetchUsers();
  }
  
  fetchUsers(): void {
    this.loading = true;

    this.userService.getFilterUsers(this.filter).subscribe({
      next: (value) => {
          this.loading = false;

          this.totalElements = value.page.totalElements;

          this.size = value.page.size;

          this.users = value.content;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({ closable: true, summary: error.message, severity: 'error'});
      }
    });

  }
 
}
