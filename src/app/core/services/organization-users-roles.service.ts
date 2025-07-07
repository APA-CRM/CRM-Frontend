import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RoleModel} from '../../models/roles/role-model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationUsersRolesService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient
  ) {
  }

  public addRoleForOrganizationUser(
    organizationId: number, userId: number,
    roleId: number
  ): Observable<RoleModel> {
    return this.http.put<RoleModel>(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}/roles/${roleId}`,
      null
    );
  }

  public removeRoleForUserOrganization(
    organizationId: number, userId: number,
    roleId: number
  ): Observable<Object> {
    return this.http.delete(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}/roles/${roleId}`);
  }

}
