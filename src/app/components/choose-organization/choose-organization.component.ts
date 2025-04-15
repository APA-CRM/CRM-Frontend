import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../core/services/organization.service';
import { MessageService } from 'primeng/api';
import { OrganizationPreview } from '../../core/models/organization-preview';
import { ErrorMessage } from '../../core/models/error-message';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { OrganizationHolderService } from '../../core/services/organization-holder.service';

@Component({
  selector: 'app-choose-organization',
  imports: [
    ProgressSpinnerModule,
    CardModule,
    CommonModule,
    MessageModule,
    ButtonModule
  ],
  templateUrl: './choose-organization.component.html',
  styleUrl: './choose-organization.component.css'
})
export class ChooseOrganizationComponent implements OnInit{
  organizations: OrganizationPreview[] = [];
  loading = true;

  constructor(
    private organizationService: OrganizationService,
    private messageService: MessageService,
    private router: Router,
    private organizationHolder: OrganizationHolderService
  ){}

  async ngOnInit() {
    this.organizationService.getOrganizationOfUser().subscribe({
      next: (data) => {
        this.organizations = data;
        this.loading = false;
      },
      error: (err) => {
        const error: ErrorMessage = err.error;

        this.messageService.add(
          {
            closable: true, 
            detail: error.message, 
            summary: "Something went wrong", 
            severity: 'error'
          }
        );
        this.loading = false;
      }
    });
  }

  selectOrganization(org: OrganizationPreview) {
    this.organizationHolder.setOrganizationId(org.id);
    this.router.navigate(['']);
  }

  createOrganization() {
    this.router.navigate(['/organization/create']);
  }

}
