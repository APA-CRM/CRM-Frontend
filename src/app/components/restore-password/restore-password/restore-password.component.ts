import {Component} from '@angular/core';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputGroupModule} from 'primeng/inputgroup';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../core/services/user.service';
import {Router} from '@angular/router';
import {matchPasswordValidator} from '../../../core/validators/password-validator';
import {UserChangePasswordRequest} from '../../../models/users/user-change-password-request';
import {UserHolderService} from '../../../core/services/user-holder.service';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {MessageService} from 'primeng/api';
import {FloatLabelModule} from 'primeng/floatlabel';
import {ButtonDirective, ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-restore-password',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    ButtonDirective,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.css'
})
export class RestorePasswordComponent {

  protected resetPasswordForm: FormGroup;

  protected isLoading: boolean = false

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private userHolder: UserHolderService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {validators: matchPasswordValidator("password", "confirmPassword")}
    );
  }

  isInvalidField(key: string): boolean {
    return this.resetPasswordForm.controls[key].invalid &&
      this.resetPasswordForm.controls[key].touched;
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) return;

    this.isLoading = true

    const currentUserId = this.userHolder.getCurrentUserId();
    const request: UserChangePasswordRequest = this.resetPasswordForm.value;

    this.userService.changeUserPassword(currentUserId, request).subscribe({
      next: () => {
        this.isLoading = false

        this.goToOrganizationChoosePage();
      },
      error: err => {
        this.isLoading = false
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

  goToOrganizationChoosePage(): void {
    this.router.navigate(['/organization/choose']);
  }

}
