import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OrganizationModel} from '../../../models/organizations/organization-model';
import {OrganizationRequest} from '../../../models/organizations/organization-request';
import {OrganizationPreviewModel} from '../../../models/organizations/organization-preview-model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient
  ) {
  }

  public createOrganization(body: OrganizationRequest): Observable<OrganizationModel> {
    return this.http.post<OrganizationModel>(environment.apiUrl + this.BASE_URI, body);
  }

  public getOrganizationPreview(organizationId: number): Observable<OrganizationPreviewModel> {
    return this.http.get<OrganizationPreviewModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}/preview`);
  }

  public getOrganization(organizationId: number): Observable<OrganizationModel> {
    return this.http.get<OrganizationModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}`);
  }

  public updateOrganization(organizationId: number, request: OrganizationRequest): Observable<OrganizationModel> {
    return this.http.put<OrganizationModel>(environment.apiUrl + this.BASE_URI + `/${organizationId}`, request);
  }

  public getOrganizationOfUser(): Observable<OrganizationPreviewModel[]> {
    return this.http.get<OrganizationPreviewModel[]>(environment.apiUrl + this.BASE_URI);
  }
}
