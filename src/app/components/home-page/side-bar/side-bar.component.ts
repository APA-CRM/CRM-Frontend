import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UserService } from '../../../core/services/user.service';
import { OrganizationService } from '../../../core/services/organization.service';
import { OrganizationPreviewModel } from '../../../models/organizations/organization-preview-model';
import { UserModel } from '../../../models/users/user-model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ErrorMessageModel } from '../../../models/error/error-message-model';
import { OrganizationHolderService } from '../../../core/services/organization-holder.service';
import { SkeletonModule } from 'primeng/skeleton';
import { CommonModule } from '@angular/common';

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
export class SideBarComponent implements OnInit{
  
  protected currentUser!: UserModel;

  protected organizationOfUser: OrganizationPreviewModel[] = [];

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private organizationHolder: OrganizationHolderService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAuthenticatedUser();
    this.fetchOrganizationsOfUser();
  }

  protected getLabelForAvatar(value: string): string {
    if(value){
      return value.charAt(0).toUpperCase();
    }

    return 'C';
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
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

  navigateTo(uri: string) {
    this.router.navigate([uri]);
  }

}
