import {Component, OnInit} from '@angular/core';
import {OrganizationInvitationService} from '../../core/services/organization-invitation.service';
import {OrganizationHolderService} from '../../core/services/organization-holder.service';
import {InvitationModel} from '../../models/invitations/invitation-model';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorMessageModel} from '../../models/error/error-message-model';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {SkeletonModule} from 'primeng/skeleton';

@Component({
  selector: 'app-invitation',
  imports: [
    CardModule,
    ButtonModule,
    SkeletonModule,
    DatePipe
  ],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent implements OnInit {

  loading = false;

  invitationNotFound = false;

  invitation!: InvitationModel;

  constructor(
    private invitationService: OrganizationInvitationService,
    private organizationHolder: OrganizationHolderService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const invitationId = params.get('invitationId');

      this.fetchInvitation(invitationId!);
    })
  }

  acceptInvitation(): void {
    this.invitationService.acceptInvitation(this.invitation.id).subscribe({
      next: data => {
        this.messageService.add({
          closable: true,
          summary: `You has been added to ${this.invitation.organization.name}`,
          severity: 'success'
        })
        this.organizationHolder.setCurrentOrganization(this.invitation.organization.id, this.invitation.organization.name);
        this.goToHomePage()
      },
      error: err => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

  declineInvitation(): void {
    this.invitationService.declineInvitation(this.invitation.id).subscribe({
      next: data => {
        this.messageService.add({
          closable: true,
          summary: `You has been decline the invitation to ${this.invitation.organization.name}`,
          severity: 'success'
        })
        this.goToHomePage()
      },
      error: err => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

  goToHomePage(): void {
    this.router.navigate(['']);
  }

  private fetchInvitation(invitationId: string) {
    this.loading = true;

    this.invitationService.getInvitation(invitationId)
      .subscribe({
        next: data => {
          this.invitation = data;
          this.loading = false;
        },
        error: err => {
          const error: ErrorMessageModel = err.error;
          this.loading = false;

          if (err.status === 404) {
            this.invitationNotFound = true;
            return;
          }

          this.messageService.add({closable: true, summary: error.message, severity: 'error'})
        }
      })
  }
}
