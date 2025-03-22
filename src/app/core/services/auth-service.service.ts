import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request';
import { AuthDetails } from '../models/auth-response';
import { EnvironmentDev } from '../environment/environment.dev';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly TOKEN_TYPE_KEY = 'tokenType';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'

  constructor(
    private http: HttpClient,
    private env: EnvironmentDev
  ) {}

  public signUp(authRequest: AuthRequest): Observable<AuthDetails> {
      return this.http.post<AuthDetails>(this.env.apiUrl + '/api/auth/sign-up', authRequest);
  }

  public saveCredential(authResponse: AuthDetails): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.TOKEN_TYPE_KEY, authResponse.tokenType);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
  }

}
