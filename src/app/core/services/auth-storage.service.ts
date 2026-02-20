import {Injectable} from '@angular/core';
import {AuthDetails} from '../../models/auth/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  private readonly TOKEN_KEY = 'token';
  private readonly TOKEN_TYPE_KEY = 'tokenType';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'

  public saveCredential(authResponse: AuthDetails): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.TOKEN_TYPE_KEY, authResponse.tokenType);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
  }

  public removeCredential(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  public getTokenWithType(): string | null {
    const tokenType: string | null = localStorage.getItem(this.TOKEN_TYPE_KEY);
    const token: string | null = localStorage.getItem(this.TOKEN_KEY);

    return tokenType && token ? `${tokenType} ${token}` : null;
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

}
