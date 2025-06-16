import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EnvironmentDev} from '../environment/environment.dev';
import {Observable} from 'rxjs';
import {RoleModel} from '../../models/roles/role-model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationUsersRolesService {

  private readonly BASE_URI = '/api/organizations/'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {
  }

  public addRoleForOrganizationUser(
    organizationId: number, userId: number,
    roleId: number
  ): Observable<RoleModel> {
    return this.http.put<RoleModel>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}/roles/${roleId}`,
      null
    );
  }

  public removeRoleForUserOrganization(
    organizationId: number, userId: number,
    roleId: number
  ): Observable<Object> {
    return this.http.delete(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}/roles/${roleId}`);
  }

}
