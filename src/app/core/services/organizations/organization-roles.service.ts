import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {RoleModel} from '../../../models/roles/role-model';
import {Observable} from 'rxjs';
import {RoleRequest} from '../../../models/roles/create-role-request';
import {RoleFilterRequest} from '../../../models/roles/role-filter-request';
import {PageModel} from '../../../models/page/page-model';
import {FilterRequestToHttpParamsAdapter} from '../../adapter/filter-request-to-http-params-adapter.service';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationRolesService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient,
    private requestToHttpParamsAdapter: FilterRequestToHttpParamsAdapter
  ) {
  }


  public getOrganizationUsers(organizationId: number): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/roles`
    );
  }

  public createRoleForOrgnization(request: RoleRequest, organizationId: number): Observable<RoleModel> {
    return this.http.post<RoleModel>(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/roles`, request
    );
  }

  public filterOrganizationRoles(request: RoleFilterRequest, organizationId: number): Observable<PageModel<RoleModel>> {
    let httpParams = this.requestToHttpParamsAdapter.toHttpParams(request);

    return this.http.get<PageModel<RoleModel>>(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/roles/filter`, {params: httpParams}
    );
  }

  public updateOrganizationRole(request: RoleRequest, organizationId: number, roleId: number): Observable<RoleModel> {
    return this.http.put<RoleModel>(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/roles/${roleId}`, request
    );
  }

  public deleteOrganizationRole(organizationId: number, roleId: number): Observable<Object> {
    return this.http.delete(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/roles/${roleId}`
    );
  }

}
