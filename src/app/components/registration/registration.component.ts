import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {AuthService} from '../../core/services/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabelModule} from 'primeng/floatlabel';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputGroupModule} from 'primeng/inputgroup';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {SignUpRequest} from '../../models/auth/sign-up-request';
import {ErrorMessageModel} from '../../models/error/error-message-model';
import {CheckboxModule} from 'primeng/checkbox';
import {AuthStorageService} from '../../core/services/auth-storage.service';
import {matchPasswordValidator} from '../../core/validators/password-validator';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    CheckboxModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private authStorage: AuthStorageService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
        login: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        generatePassword: [true],
        password: [''],
        confirmPassword: ['']
      },
      {
        validators: [
          matchPasswordValidator('password', 'confirmPassword'),
        ]
      }
    );
  }

  isInvalidField(field: string): boolean {
    return this.registerForm.controls[field].invalid &&
      this.registerForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {

      const signUpRequest: SignUpRequest = this.registerForm.value;

      this.authService.signUp(signUpRequest).subscribe({
        next: userDetails => {
          this.authStorage.saveCredential(userDetails);
          this.router.navigate(['/organization/choose']);
        },
        error: err => {
          const error: ErrorMessageModel = err.error;

          this.messageService.add({closable: true, summary: error.message, severity: 'error'})
        }
      })
    }
  }

  togglePasswordFields() {
    if (this.registerForm.get('generatePassword')?.value) {
      this.registerForm.get('password')?.setValidators([]);
      this.registerForm.get('confirmPassword')?.setValidators([]);
      this.registerForm.get('password')?.reset();
      this.registerForm.get('confirmPassword')?.reset();
    } else {
      this.registerForm.get('password')?.setValidators(Validators.required);
      this.registerForm.get('confirmPassword')?.setValidators(Validators.required);
    }

    this.registerForm.get('password')?.updateValueAndValidity();
    this.registerForm.get('confirmPassword')?.updateValueAndValidity();
  }

  goToLoginPage(): void {
    this.router.navigate(['/login']);
  }

}
