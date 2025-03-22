import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../core/services/auth-service.service';
import { AuthRequest } from '../../core/models/auth-request';
import { MessageService } from 'primeng/api';
import { AuthDetails } from '../../core/models/auth-response';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../core/models/error-message';

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
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: AuthRequest = this.loginForm.value;
      
      this.authService.signUp(credentials)
      .subscribe({
        next: details => {
          this.authService.saveCredential(details);
          this.router.navigate(['']);
        },
        error: err => {
          const error: ErrorMessage = err.error; 
          
          this.messageService.add({closable: true, summary: 'Something went wrong', detail: error.message, severity: 'error'})
        }
      });
    }
  }

  isInvalidField(key: string): boolean {
    return this.loginForm.controls[key].invalid && 
        this.loginForm.controls[key].touched;
  }

}
