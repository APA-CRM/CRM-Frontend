import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentDev } from '../environment/environment.dev';
import { RoleModel } from '../../models/roles/role-model';
import { Observable } from 'rxjs';
import { RoleRequest } from '../../models/roles/create-role-request';
import { RoleFilterRequest } from '../../models/roles/role-filter-request';
import { PageModel } from '../../models/page/page-model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationRolesService {

  private readonly BASE_URI = '/api/organizations/'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {}


  public getOrganizationUsers(organizationId: number): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/roles` 
    );
  }

  public createRoleForOrgnization(request: RoleRequest, organizationId: number): Observable<RoleModel> {
    return this.http.post<RoleModel>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/roles`, request
    );
  }

  public filterOrganizationRoles(request: RoleFilterRequest, organizationId: number): Observable<PageModel<RoleModel>> {
    return this.http.post<PageModel<RoleModel>>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/roles/filter`, request
    );
  }

  public updateOrganizationRole(request: RoleRequest, organizationId: number, roleId: number): Observable<RoleModel> {
    return this.http.put<RoleModel>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/roles/${roleId}`, request
    );
  }

  public deleteOrganizationRole(organizationId: number, roleId: number): Observable<Object> {
    return this.http.delete(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/roles/${roleId}`
    );
  }

}
