import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CreateRestorePasswordRequest} from '../../models/restore-password/create-restore-password-request';
import {PasswordRestoreRequestModel} from '../../models/restore-password/password-restore-request-model';
import {VerifyCode} from '../../models/restore-password/verify-code';
import {AuthDetails} from '../../models/auth/auth-response';

@Injectable({
  providedIn: 'root'
})
export class RestorePasswordService {

  private readonly BASE_URI = '/api/restore-password-request'

  constructor(private http: HttpClient) {
  }

  public createPasswordRestoreRequest(body: CreateRestorePasswordRequest): Observable<PasswordRestoreRequestModel> {
    return this.http.post<PasswordRestoreRequestModel>(environment.apiUrl + this.BASE_URI, body);
  }

  public verifyCode(requestId: string, code: VerifyCode): Observable<AuthDetails> {
    return this.http.put<AuthDetails>(
      environment.apiUrl + this.BASE_URI + `/${requestId}/restore-password`, code
    );
  }

  public resendCode(requestId: string): Observable<PasswordRestoreRequestModel> {
    return this.http.patch<PasswordRestoreRequestModel>(
      environment.apiUrl + this.BASE_URI + `/${requestId}/resend`, null
    );
  }

}
