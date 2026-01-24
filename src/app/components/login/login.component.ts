import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {FloatLabelModule} from 'primeng/floatlabel';
import {AuthService} from '../../core/services/auth.service';
import {AuthRequest} from '../../models/auth/auth-request';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {ErrorMessageModel} from '../../models/error/error-message-model';
import {AuthStorageService} from '../../core/services/auth-storage.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authStorage: AuthStorageService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: AuthRequest = this.loginForm.value;

      this.authService.signIn(credentials)
        .subscribe({
          next: details => {
            this.authStorage.saveCredential(details);
            this.router.navigate(['/organization/choose']);
          },
          error: err => {
            const error: ErrorMessageModel = err.error;

            this.messageService.add({closable: true, summary: error.message, severity: 'error'})
          }
        });
    }
  }

  goToRegistrationPage(): void {
    this.router.navigate(['registration'])
  }

  goToForgotPasswordPage(): void {
    this.router.navigate(['forgot-password'])
  }

  isInvalidField(key: string): boolean {
    return this.loginForm.controls[key].invalid &&
      this.loginForm.controls[key].touched;
  }

}
