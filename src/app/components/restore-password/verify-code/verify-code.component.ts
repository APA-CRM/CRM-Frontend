import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {VerifyCode} from '../../../models/restore-password/verify-code';
import {ButtonDirective} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {AuthStorageService} from '../../../core/services/auth-storage.service';

@Component({
  selector: 'app-verify-code',
  imports: [
    ButtonDirective,
    FloatLabel,
    InputGroup,
    InputGroupAddon,
    InputText,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent implements OnInit {

  protected verifyForm: FormGroup;

  protected isLoading: boolean = false;

  protected requestId!: string;

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
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
    this.isLoading = true;

    this.authService.verifyCode(this.requestId, request).subscribe({
      next: (details) => {
        this.isLoading = false;

        this.authStorage.saveCredential(details);
        this.router.navigate(['/organization/choose']);
      },
      error: err => {
        this.isLoading = false;
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'})
      }
    })
  }

}
