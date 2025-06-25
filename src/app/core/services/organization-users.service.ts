import {Injectable} from '@angular/core';
import {UserWithRolesModel} from '../../models/users/user-with-roles-model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageModel} from '../../models/page/page-model';
import {UsersFilterRequest} from '../../models/users/users-filter-request';
import {EnvironmentDev} from '../environment/environment.dev';
import {FilterRequestMapperService} from '../mapper/filter-request-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationUsersService {

  private readonly BASE_URI = '/api/organizations'

  constructor(
    private http: HttpClient,
    private filterRequestMapperService: FilterRequestMapperService,
    private env: EnvironmentDev
  ) {
  }

  public getFilterUsers(filter: UsersFilterRequest, organizationId: number): Observable<PageModel<UserWithRolesModel>> {
    let params: HttpParams = this.filterRequestMapperService.mapUserFilterRequestToHttpParams(filter);

    return this.http.get<PageModel<UserWithRolesModel>>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/users/filter`, {params: params}
    );
  }

  public removeUserFromOrganization(organizationId: number, userId: number): Observable<Object> {
    return this.http.delete(this.env.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}`);
  }

}
