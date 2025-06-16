import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../core/services/auth.service';
import {of, throwError} from 'rxjs';
import {AuthDetails} from '../../models/auth/auth-response';
import {ErrorMessageModel} from '../../models/error/error-message-model';
import {AuthStorageService} from '../../core/services/auth-storage.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let authStorageMock: any;
  let messageServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      signIn: jasmine.createSpy('signIn'),
    };

    authStorageMock = {
      saveCredential: jasmine.createSpy('saveCredential')
    }

    messageServiceMock = {
      add: jasmine.createSpy('add')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: MessageService, useValue: messageServiceMock},
        {provide: Router, useValue: routerMock},
        {provide: AuthStorageService, useValue: authStorageMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('login')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form invalid if required fields are empty', () => {
    component.loginForm.setValue({login: '', password: ''});
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should call AuthService.signUp and navigate on successful login', () => {
    const mockResponse: AuthDetails = {
      token: 'abc123',
      tokenType: 'Bearer',
      refreshToken: 'refresh123'
    };

    authServiceMock.signIn.and.returnValue(of(mockResponse));
    component.loginForm.setValue({login: 'user', password: 'pass'});

    component.onSubmit();

    expect(authServiceMock.signIn).toHaveBeenCalledWith({login: 'user', password: 'pass'});
    expect(authStorageMock.saveCredential).toHaveBeenCalledWith(mockResponse);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/organization/choose']);
  });

  it('should show error message on failed login', () => {
    const mockError = {
      error: {message: 'Invalid credentials'} as ErrorMessageModel
    };

    authServiceMock.signIn.and.returnValue(throwError(() => mockError));
    component.loginForm.setValue({login: 'user', password: 'wrongpass'});

    component.onSubmit();

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      closable: true,
      summary: 'Invalid credentials',
      severity: 'error'
    });
  });

  it('should not call AuthService.signUp if form is invalid', () => {
    component.loginForm.setValue({login: '', password: ''});

    component.onSubmit();

    expect(authServiceMock.signIn).not.toHaveBeenCalled();
  });

  it('isInvalidField should return true for touched and invalid fields', () => {
    const loginControl = component.loginForm.get('login');
    loginControl?.markAsTouched();
    loginControl?.setValue('');
    expect(component.isInvalidField('login')).toBeTrue();
  });
});
