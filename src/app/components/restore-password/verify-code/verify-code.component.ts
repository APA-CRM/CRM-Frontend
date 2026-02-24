import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {VerifyCode} from '../../../models/restore-password/verify-code';
import {ButtonDirective, ButtonModule} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {AuthStorageService} from '../../../core/services/auth-storage.service';
import {RestorePasswordService} from '../../../core/services/restore-password.service';

@Component({
  selector: 'app-verify-code',
  imports: [
    ButtonDirective,
    FloatLabel,
    InputGroup,
    InputGroupAddon,
    InputText,
    NgIf,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent implements OnInit {

  protected verifyForm: FormGroup;

  protected loadingStateVerifyCode: boolean = false;
  protected loadingStateResendCode: boolean = false;

  protected requestId!: string;

  constructor(
    formBuilder: FormBuilder,
    private restorePasswordService: RestorePasswordService,
    private authStorage: AuthStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.verifyForm = formBuilder.group({
      verificationCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('requestId')!;
  }

  isInvalidField(key: string): boolean {
    return this.verifyForm.controls[key].invalid &&
      this.verifyForm.controls[key].touched;
  }

  onSubmit() {
    const request: VerifyCode = this.verifyForm.value;
    this.loadingStateVerifyCode = true;

    this.restorePasswordService.verifyCode(this.requestId, request).subscribe({
      next: (details) => {
        this.loadingStateVerifyCode = false;

        this.authStorage.saveCredential(details);
        this.router.navigate(['restore-password']);
      },
      error: err => {
        this.loadingStateVerifyCode = false;
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

  resendCode() {
    this.loadingStateResendCode = true;

    this.restorePasswordService.resendCode(this.requestId).subscribe({
      next: () => {
        this.loadingStateResendCode = false;

        this.messageService.add({closable: true, summary: "Verification code has been resented", severity: 'success'})
      },
      error: err => {
        this.loadingStateResendCode = true;
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

}
