import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnvironmentDev } from '../environment/environment.dev';

describe('AuthServiceService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  let env: EnvironmentDev;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
    env = TestBed.inject(EnvironmentDev);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sign in request should return observable',  () => {
    
    const expectedValue = {token: 'token', tokenType: 'tokenType', refreshToken: 'refreshToken'};
    
    
    service.signUp({login: 'login', password: 'password'})
    .subscribe({
      next: details => {
        expect(details).toBe(expectedValue)
      }
    });
    
    const request = controller.expectOne(env.apiUrl + '/api/auth/sign-up');
    
    request.flush(expectedValue);
  })

  it('save credentials should save them', () => {
    const expectedValue = {token: 'token', tokenType: 'tokenType', refreshToken: 'refreshToken'};

    service.saveCredential(expectedValue);

    expect(localStorage.getItem('token')).toBe(expectedValue.token);
    expect(localStorage.getItem('tokenType')).toBe(expectedValue.tokenType);
    expect(localStorage.getItem('refreshToken')).toBe(expectedValue.refreshToken);
  })

});
