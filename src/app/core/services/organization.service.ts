import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EnvironmentDev} from '../environment/environment.dev';
import {Observable} from 'rxjs';
import {OrganizationModel} from '../../models/organizations/organization-model';
import {OrganizationCreateRequest} from '../../models/organizations/organization-create-request';
import {OrganizationPreviewModel} from '../../models/organizations/organization-preview-model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {
  }

  public createOrganization(body: OrganizationCreateRequest): Observable<OrganizationModel> {
    return this.http.post<OrganizationModel>(this.env.apiUrl + this.BASE_URI, body);
  }

  public getOrganizationPreview(organizationId: number): Observable<OrganizationPreviewModel> {
    return this.http.get<OrganizationPreviewModel>(this.env.apiUrl + this.BASE_URI + `/${organizationId}/preview`);
  }

  public getOrganizationOfUser(): Observable<OrganizationPreviewModel[]> {
    return this.http.get<OrganizationPreviewModel[]>(this.env.apiUrl + this.BASE_URI);
  }
}
