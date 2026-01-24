import {Component} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {CreateRestorePasswordRequest} from '../../../models/restore-password/create-restore-password-request';
import {MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../models/error/error-message-model';

@Component({
  selector: 'app-create-restore-password-request',
  imports: [
    FloatLabel,
    InputGroupAddonModule,
    InputGroupModule,
    ReactiveFormsModule,
    InputTextModule,
    NgIf,
    ButtonModule
  ],
  templateUrl: './create-restore-password-request.component.html',
  styleUrl: './create-restore-password-request.component.css'
})
export class CreateRestorePasswordRequestComponent {

  protected verifyForm: FormGroup;

  protected isLoading: boolean = false;

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.verifyForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  isInvalidField(key: string): boolean {
    return this.verifyForm.controls[key].invalid &&
      this.verifyForm.controls[key].touched;
  }

  goBackToLogin() {
    this.router.navigate(['login']);
  }

  onSubmit() {
    const request: CreateRestorePasswordRequest = this.verifyForm.value;
    this.isLoading = true;

    this.authService.createPasswordRestoreRequest(request).subscribe({
      next: (value) => {
        this.isLoading = false;

        this.router.navigate([`verify-code/${value.id}`]);
      },
      error: err => {
        this.isLoading = false;
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }
}
