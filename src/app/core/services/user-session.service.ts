import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserSessionModel} from '../../models/users/user-session-model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  private readonly BASE_URI = '/api/users/sessions';

  constructor(private http: HttpClient) {
  }

  public getUserSessions(): Observable<UserSessionModel[]> {
    return this.http.get<UserSessionModel[]>(`${environment.apiUrl}${this.BASE_URI}`);
  }

  public endUserSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${this.BASE_URI}/${sessionId}`);
  }

  public endAllUsersSessions(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${this.BASE_URI}`);
  }

}
