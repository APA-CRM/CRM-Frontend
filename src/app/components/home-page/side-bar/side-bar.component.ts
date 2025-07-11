import {Component, OnInit} from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {UserService} from '../../../core/services/user.service';
import {OrganizationService} from '../../../core/services/organization.service';
import {OrganizationPreviewModel} from '../../../models/organizations/organization-preview-model';
import {UserModel} from '../../../models/users/user-model';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {OrganizationHolderService} from '../../../core/services/organization-holder.service';
import {SkeletonModule} from 'primeng/skeleton';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [
    AvatarModule,
    AvatarGroupModule,
    SkeletonModule,
    CommonModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {

  sideBarContent: { uri: string, icon: string, name: string }[] = [
    {
      uri: "",
      icon: "pi-home",
      name: "Home",
    },
    {
      uri: "users",
      icon: "pi-user",
      name: "Users",
    },
    {
      uri: "roles",
      icon: "pi-users",
      name: "Roles",
    },
  ]
  protected currentUser!: UserModel;
  protected organizationOfUser: OrganizationPreviewModel[] = [];

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private organizationHolder: OrganizationHolderService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchAuthenticatedUser();
    this.fetchOrganizationsOfUser();
  }

  navigateTo(uri: string) {
    this.router.navigate([uri]);
  }

  protected getLabelForAvatar(value: string): string {
    if (value) {
      return value.charAt(0).toUpperCase();
    }

    return 'C';
  }

  protected changeOrganization(organization: OrganizationPreviewModel): void {
    if (organization.id !== this.organizationHolder.getOrganizationId()) {
      this.organizationHolder.setOrganizationId(organization.id);
      this.messageService.add({closable: true, summary: `You switched to ${organization.name}`, severity: 'success'});
    }

    this.router.navigate([``]);
  }

  private fetchAuthenticatedUser(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (value) => {
        this.currentUser = value;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

  private fetchOrganizationsOfUser(): void {
    this.organizationService.getOrganizationOfUser().subscribe({
      next: (value) => {
        this.organizationOfUser = value;

        let organizationIds = value.map(organization => organization.id);

        this.organizationHolder.setUserOrganizations(organizationIds);
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

}
