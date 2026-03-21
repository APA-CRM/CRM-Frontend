import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NotificationService} from '../../../core/services/notification.service';
import {MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {Toast} from 'primeng/toast';
import {NotificationType} from '../../../core/enums/notification-type';

@Component({
  selector: 'app-home',
  imports: [
    SideBarComponent,
    RouterOutlet,
    Button,
    NgIf,
    Toast,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  notificationType = NotificationType;

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.notificationService.initConnection();

    this.notificationService.userNotifications$.subscribe(
      value => {
        if (this.isCustomNotification(value.messageCode)) {
          this.messageService.add({
            key: "notifications",
            life: 5000,
            closable: true,
            data: value,
            summary: value.title,
            detail: value.message,
            severity: 'info'
          });
        } else {
          this.messageService.add({closable: true, summary: value.title, detail: value.message, severity: 'info'});
        }
      }
    )

    this.notificationService.organizationNotifications$.subscribe(value => {
      this.messageService.add({closable: true, summary: value.title, detail: value.message, severity: 'info'});
    })
  }

  isCustomNotification(messageCode: NotificationType): boolean {
    return messageCode === NotificationType.USER_HAS_BEEN_INVITED_TO_ORGANIZATION ||
      messageCode === NotificationType.USER_HAS_BEEN_ADDED_TO_THE_ORGANIZATION;
  }

  closeMessage(): void {
    this.messageService.clear("notifications");
  }

}
