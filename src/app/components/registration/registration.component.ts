import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { SignUpRequest } from '../../models/sign-up-request';
import { ErrorMessage } from '../../models/error-message';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthStorageService } from '../../core/services/auth-storage.service';

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
  ){
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      generatePassword: [true],
      password: [''],
      confirmPassword: ['']
    },
    {
      validators: [
        this.matchPasswordValidator('password', 'confirmPassword'), 
        this.matchFirstNameAndLastName('firstName', 'lastName')
      ]
    }
    );
  }

  matchPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
        const control = abstractControl.get(controlName);
        const matchingControl = abstractControl.get(matchingControlName);

        if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
            return null;
        }

        if (control!.value !== matchingControl!.value) {
          const error = { confirmedValidator: 'Passwords do not match.' };
          matchingControl!.setErrors(error);
          return error;
        } else {
          matchingControl!.setErrors(null);
          return null;
        }
    }
  }

  matchFirstNameAndLastName(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if(control?.value || matchingControl?.value){
        return null
      }

      return { confirmedValidator: "First name and last name can't be null." };
    }
  }

  isInvalidField(field: string): boolean {
    return this.registerForm.controls[field].invalid && 
      this.registerForm.controls[field].touched;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {

      var signUpRequest: SignUpRequest = this.registerForm.value;

      console.log(signUpRequest);
    
      this.authService.signUp(signUpRequest).subscribe({
        next: userDetails => {
          this.authStorage.saveCredential(userDetails);
          this.router.navigate(['/organization/choose']);
        },
        error: err => {
          const error: ErrorMessage = err.error;

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

}
