import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EnvironmentDev} from '../environment/environment.dev';
import {Observable} from 'rxjs';
import {UserModel} from '../../models/users/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URI = '/api/users'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {
  }

  public getAuthenticatedUser(): Observable<UserModel> {
    return this.http.get<UserModel>(this.env.apiUrl + this.BASE_URI + '/me');
  }

  public getUsersByFullName(fullName: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.env.apiUrl + this.BASE_URI, {params: {"fullName": fullName}});
  }

}
