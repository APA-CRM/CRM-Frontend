import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {RouterOutlet} from '@angular/router';
import {NotificationService} from '../../../core/services/notification.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-home',
  imports: [
    SideBarComponent,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.notificationService.initConnection();

    this.notificationService.userNotifications$.subscribe(
      value => {
        this.messageService.add({closable: true, summary: value.title, detail: value.message, severity: 'info'});
      }
    )

    this.notificationService.organizationNotifications$.subscribe(value => {
      this.messageService.add({closable: true, summary: value.title, detail: value.message, severity: 'info'});
    })
  }

}
