import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserModel} from '../../models/users/user-model';
import {UserUpdateRequest} from '../../models/users/user-update-request';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URI = '/api/users'

  constructor(
    private http: HttpClient
  ) {
  }

  public getAuthenticatedUser(): Observable<UserModel> {
    return this.http.get<UserModel>(environment.apiUrl + this.BASE_URI + '/me');
  }

  public getUsersByFullName(fullName: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(environment.apiUrl + this.BASE_URI, {params: {"fullName": fullName}});
  }

  public getUserById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrl}${this.BASE_URI}/${id}`);
  }

  public updateUser(id: number, request: UserUpdateRequest): Observable<UserModel> {
    return this.http.patch<UserModel>(`${environment.apiUrl}${this.BASE_URI}/${id}`, request);
  }

}
