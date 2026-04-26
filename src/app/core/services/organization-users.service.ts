import {Injectable} from '@angular/core';
import {UserWithRolesModel} from '../../models/users/user-with-roles-model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageModel} from '../../models/page/page-model';
import {UsersFilterRequest} from '../../models/users/users-filter-request';
import {FilterRequestToHttpParamsAdapter} from '../adapter/filter-request-to-http-params-adapter.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationUsersService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient,
    private requestToHttpParamsAdapter: FilterRequestToHttpParamsAdapter
  ) {
  }

  public getFilterUsers(filter: UsersFilterRequest, organizationId: number): Observable<PageModel<UserWithRolesModel>> {
    let params: HttpParams = this.requestToHttpParamsAdapter.toHttpParams(filter);

    return this.http.get<PageModel<UserWithRolesModel>>(
      environment.apiUrl + this.BASE_URI + `/${organizationId}/users/filter`, {params: params}
    );
  }

  public removeUserFromOrganization(organizationId: number, userId: number): Observable<Object> {
    return this.http.delete(environment.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}`);
  }

}
