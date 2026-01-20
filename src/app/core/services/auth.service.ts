import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthRequest} from '../../models/auth/auth-request';
import {AuthDetails} from '../../models/auth/auth-response';
import {Observable} from 'rxjs';
import {SignUpRequest} from '../../models/auth/sign-up-request';
import {AuthStorageService} from './auth-storage.service';
import {environment} from '../../../environments/environment';
import {PasswordRestoreRequestModel} from '../../models/restore-password/password-restore-request-model';
import {CreateRestorePasswordRequest} from '../../models/restore-password/create-restore-password-request';
import {VerifyCode} from '../../models/restore-password/verify-code';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly BASE_URI = '/api/auth'

  constructor(
    private http: HttpClient,
    private authStorage: AuthStorageService
  ) {
  }

  public signIn(authRequest: AuthRequest): Observable<AuthDetails> {
    return this.http.post<AuthDetails>(environment.apiUrl + this.BASE_URI + '/sign-in', authRequest);
  }

  public signUp(signUpRequest: SignUpRequest): Observable<AuthDetails> {
    return this.http.post<AuthDetails>(environment.apiUrl + this.BASE_URI + '/sign-up', signUpRequest);
  }

  public refreshToken(): Observable<AuthDetails> {
    const body = {refreshToken: this.authStorage.getRefreshToken()};

    return this.http.post<AuthDetails>(environment.apiUrl + this.BASE_URI + '/refresh', body);
  }

  public createPasswordRestoreRequest(body: CreateRestorePasswordRequest): Observable<PasswordRestoreRequestModel> {
    return this.http.post<PasswordRestoreRequestModel>(environment.apiUrl + this.BASE_URI + '/restore-password-request', body);
  }

  public verifyCode(requestId: string, code: VerifyCode): Observable<AuthDetails> {
    return this.http.put<AuthDetails>(
      environment.apiUrl + this.BASE_URI + `/restore-password-request/${requestId}/restore-password`, code
    );
  }

  public resendCode(requestId: string): Observable<PasswordRestoreRequestModel> {
    return this.http.patch<PasswordRestoreRequestModel>(
      environment.apiUrl + this.BASE_URI + `/restore-password-request/${requestId}/resend`, null
    );
  }

}
