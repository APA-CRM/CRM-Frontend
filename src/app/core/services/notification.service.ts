import {Injectable} from '@angular/core';
import {Client} from '@stomp/stompjs';
import {AuthStorageService} from './auth-storage.service';
import {environment} from '../../../environments/environment';
import {OrganizationHolderService} from './organizations/organization-holder.service';
import {NotificationResponse} from '../../models/notifications/notification-response';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private stompClient!: Client
  private isConnected: boolean = false;

  private userNotification: Subject<NotificationResponse> = new Subject<NotificationResponse>();
  userNotifications$ = this.userNotification.asObservable();
  private organizationNotification: Subject<NotificationResponse> = new Subject<NotificationResponse>();
  organizationNotifications$ = this.organizationNotification.asObservable();

  constructor(
    private authStorage: AuthStorageService,
    private organizationHolder: OrganizationHolderService
  ) {
  }

  public initConnection(): void {
    if (!this.authStorage.getTokenWithType() || this.isConnected) {
      return;
    }

    this.stompClient = new Client({
      brokerURL: environment.apiUrl + '/ws-notifications',
      connectHeaders: {
        Authorization: this.authStorage.getTokenWithType()!,
      },
      onConnect: () => {
        this.isConnected = true;

        this.stompClient.subscribe(
          `/topic/organizations/${this.organizationHolder.getOrganizationId()}/notifications`,
          (message) => {
            const body = JSON.parse(message.body) as NotificationResponse;

            this.organizationNotification.next(body)
          }
        )

        this.stompClient.subscribe(
          '/user/topic/notifications',
          (message) => {
            const body = JSON.parse(message.body) as NotificationResponse;

            this.userNotification.next(body)
          }
        )
      },
    });

    this.stompClient.activate();
  }

}
