import { Injectable } from '@angular/core';
import { UserWithRolesModel } from '../../models/user-with-roles-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageModel } from '../../models/page-model';
import { UsersFilterRequest } from '../../models/users-filter-request';
import { EnvironmentDev } from '../environment/environment.dev';
import { UserModel } from '../../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationUsersService {

  private readonly BASE_URI = '/api/organizations/'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {}

  public getFilterUsers(filter: UsersFilterRequest, organizationId: number): Observable<PageModel<UserWithRolesModel>> {
    return this.http.post<PageModel<UserWithRolesModel>>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/users`, 
      filter
    );
  }

  public addUserToOrganization(organizationId: number, userId: number): Observable<UserModel> {
    return this.http.put<UserModel>(
      this.env.apiUrl + this.BASE_URI + `/${organizationId}/users/${userId}`, null
    );
  }

}
