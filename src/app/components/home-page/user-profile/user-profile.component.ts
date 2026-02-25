import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import {UserModel} from '../../../models/users/user-model';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserUpdateRequest} from '../../../models/users/user-update-request';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {SkeletonModule} from 'primeng/skeleton';
import {AvatarModule} from 'primeng/avatar';
import {UserHolderService} from '../../../core/services/user-holder.service';
import {UserSessionService} from '../../../core/services/user-session.service';
import {UserSessionModel} from '../../../models/users/user-session-model';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {AuthStorageService} from '../../../core/services/auth-storage.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SkeletonModule,
    AvatarModule,
    ConfirmPopupModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  user: UserModel | null = null;
  isMe: boolean = false;
  profileForm: FormGroup;
  closingSessionId: string | null = null;
  userSessions: UserSessionModel[] = [];
  profileLoading = true;
  userSessionsLoading = true;
  editing = false;
  saveLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private userSessionService: UserSessionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authStorageService: AuthStorageService,
    private userHolder: UserHolderService
  ) {
    this.profileForm = this.fb.group({
      login: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      fullName: [{value: '', disabled: true}],
      firstName: [{value: '', disabled: true}],
      lastName: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      aboutYourself: [{value: '', disabled: true}],
    });
  }

  ngOnInit(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('userId'));

    this.isMe = id === this.userHolder.getCurrentUserId();

    this.profileLoading = true;

    this.userService.getUserById(id).subscribe({
      next: data => {
        this.user = data;
        this.profileLoading = false;
        this.setFormValues(this.user)
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })

    this.userSessionService.getUserSessions().subscribe({
      next: data => {
        this.userSessions = data;
        this.userSessionsLoading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })

  }

  confirmCloseAllSessions(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to end all sessions including yours?',
      icon: 'pi pi-exclamation-triangle',
      header: 'End all sessions?',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete'
      },
      accept: () => {
        this.endAllUsersSessions();
      }
    });
  }

  confirmCloseSession(event: Event, sessionId: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to end this session?',
      icon: 'pi pi-exclamation-triangle',
      header: 'End session?',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete'
      },
      accept: () => {
        this.endSession(sessionId);
      }
    });
  }

  endSession(sessionId: string): void {
    this.closingSessionId = sessionId;

    this.userSessionService.endUserSession(sessionId).subscribe({
      next: () => {
        this.closingSessionId = null;

        this.userSessions = this.userSessions.filter(value => value.id !== sessionId);

        this.messageService.add({closable: true, summary: `Session has been closed`, severity: 'success'})
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  endAllUsersSessions(): void {
    this.userSessionService.endAllUsersSessions().subscribe({
      next: () => {
        this.userSessions = [];

        this.authStorageService.removeCredential();
        this.router.navigate(['login'])
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })
  }

  setFormValues(user: UserModel) {
    this.profileForm.patchValue({
      login: user.login,
      email: user.email,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      aboutYourself: user.aboutYourself,
    });

    this.profileForm.get('login')?.disable();
    this.profileForm.get('email')?.disable();
    this.profileForm.get('fullName')?.disable();

    if (this.isMe) {
      this.profileForm.get('firstName')?.enable();
      this.profileForm.get('lastName')?.enable();
      this.profileForm.get('phoneNumber')?.enable();
      this.profileForm.get('aboutYourself')?.enable();
    } else {
      this.profileForm.get('firstName')?.disable();
      this.profileForm.get('lastName')?.disable();
      this.profileForm.get('phoneNumber')?.disable();
      this.profileForm.get('aboutYourself')?.disable();
    }
  }

  isInvalidForm(): boolean {
    return this.profileForm.invalid;
  }

  saveProfile(): void {
    if (this.isInvalidForm()) {
      return;
    }

    this.saveLoading = true;

    const updateRequest: UserUpdateRequest = {
      firstName: this.profileForm.get("firstName")?.value,
      lastName: this.profileForm.get("lastName")?.value,
      phoneNumber: this.profileForm.get("phoneNumber")?.value,
      aboutYourself: this.profileForm.get("aboutYourself")?.value
    }

    this.userService.updateUser(this.user!.id, updateRequest).subscribe({
      next: data => {
        this.user = data;
        this.saveLoading = false;
        this.cancelEditing();

        this.messageService.add({closable: true, summary: `User has been updated`, severity: 'success'});
      },
      error: (err) => {
        this.saveLoading = false;
        const error: ErrorMessageModel = err.error;

        this.messageService.add({closable: true, summary: error.message, severity: 'error'});
      }
    })

  }

  enableEdit(): void {
    this.editing = true;
    this.setFormValues(this.user!);

    this.profileForm.patchValue({
      firstName: this.user?.firstName,
      lastName: this.user?.lastName,
      phoneNumber: this.user?.phoneNumber,
      aboutYourself: this.user?.aboutYourself
    })
  }

  cancelEditing() {
    this.editing = false;
    this.setFormValues(this.user!);
  }

  getLabelForAvatar(value: string): string {
    if (value) {
      return value.charAt(0).toUpperCase();
    }

    return 'C';
  }

}
