import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {InvitationModel} from '../../../models/invitations/invitation-model';
import {Observable} from 'rxjs';
import {InvitationRequest} from '../../../models/invitations/invitation-request';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationInvitationService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient
  ) {
  }

  public getInvitation(invitationId: string): Observable<InvitationModel> {
    return this.http.get<InvitationModel>(environment.apiUrl + this.BASE_URI + `/invitations/${invitationId}`);
  }

  public createInvitation(organizationId: number, userId: number, roleId: number | null): Observable<InvitationModel> {
    let body: InvitationRequest = {
      userId: userId,
      roleId: roleId
    };

    return this.http.post<InvitationModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}/invitations`, body)
  }

  public acceptInvitation(invitationId: string): Observable<InvitationModel> {
    return this.http.patch<InvitationModel>(environment.apiUrl + this.BASE_URI + `/invitations/${invitationId}/accept`, {});
  }

  public declineInvitation(invitationId: string): Observable<InvitationModel> {
    return this.http.patch<InvitationModel>(environment.apiUrl + this.BASE_URI + `/invitations/${invitationId}/decline`, {});
  }

}
