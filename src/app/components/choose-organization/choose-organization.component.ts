import {Component, OnInit} from '@angular/core';
import {OrganizationService} from '../../core/services/organizations/organization.service';
import {MessageService} from 'primeng/api';
import {OrganizationPreviewModel} from '../../models/organizations/organization-preview-model';
import {ErrorMessageModel} from '../../models/error/error-message-model';
import {Router} from '@angular/router';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CardModule} from 'primeng/card';
import {CommonModule} from '@angular/common';
import {MessageModule} from 'primeng/message';
import {ButtonModule} from 'primeng/button';
import {OrganizationHolderService} from '../../core/services/organizations/organization-holder.service';

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
export class ChooseOrganizationComponent implements OnInit {
  organizations: OrganizationPreviewModel[] = [];
  loading = true;

  constructor(
    private organizationService: OrganizationService,
    private messageService: MessageService,
    private router: Router,
    private organizationHolder: OrganizationHolderService
  ) {
  }

  async ngOnInit() {
    this.organizationService.getOrganizationOfUser().subscribe({
      next: (data) => {
        this.organizations = data;
        this.loading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

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

  selectOrganization(org: OrganizationPreviewModel) {
    this.organizationHolder.setCurrentOrganization(org.id, org.name);
    this.router.navigate(['']);
  }

  createOrganization() {
    this.router.navigate(['/organization/create']);
  }

}
