import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentDev } from '../environment/environment.dev';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/user-model';
import { PageModel } from '../../models/page-model';
import { UserWithRolesModel } from '../../models/user-with-roles-model';
import { UsersFilterRequest } from '../../models/users-filter-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URI = '/api/users'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {}

  public getAuthenticatedUser(): Observable<UserModel> {
    return this.http.get<UserModel>(this.env.apiUrl + this.BASE_URI + '/me');
  }

  public getFilterUsers(filter: UsersFilterRequest): Observable<PageModel<UserWithRolesModel>> {
    return this.http.post<PageModel<UserWithRolesModel>>(this.env.apiUrl + this.BASE_URI + '/filter', filter);
  }

}
