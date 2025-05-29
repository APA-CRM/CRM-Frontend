import { Component, OnInit } from '@angular/core';
import { OrganizationHolderService } from '../../core/services/organization-holder.service';
import { OrganizationRolesService } from '../../core/services/organization-roles.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { RoleFilterRequest } from '../../models/roles/role-filter-request';
import { SortDirection } from '../../core/enums/sort-direction';
import { RoleModel } from '../../models/roles/role-model';
import { Page } from '../../models/page/page';
import { ErrorMessageModel } from '../../models/error/error-message-model';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-roles-table',
  imports: [
    TableModule,
    PaginatorModule,
    TagModule,
    CommonModule
  ],
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.css'
})
export class RolesTableComponent implements OnInit {

  roles: RoleModel[] = [];

  loading: boolean = true;

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
    sortBy: null
  };

  constructor(
    private organizationHolder: OrganizationHolderService,
    private organizationRolesService: OrganizationRolesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchRoles()
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

  onPageChanged($event: PaginatorState) {
    this.request.page = $event.page!

    this.fetchRoles();
  }

}