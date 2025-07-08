import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import {UserModel} from '../../../models/users/user-model';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UserUpdateRequest} from '../../../models/users/user-update-request';
import {ErrorMessageModel} from '../../../models/error/error-message-model';
import {MessageService} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {SkeletonModule} from 'primeng/skeleton';
import {AvatarModule} from 'primeng/avatar';

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
    AvatarModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  user: UserModel | null = null;
  isMe: boolean = false;
  profileForm: FormGroup;
  loading = true;
  editing = false;
  saveLoading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
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
    this.isMe = this.route.snapshot.routeConfig?.path === 'user/me';

    this.loading = true;

    if (this.isMe) {
      this.userService.getAuthenticatedUser().subscribe({
        next: data => {
          this.user = data;
          this.loading = false;
          this.setFormValues(this.user)
        },
        error: (err) => {
          const error: ErrorMessageModel = err.error;

          this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        }
      })
    } else {
      const id = this.route.snapshot.paramMap.get('userId');

      this.userService.getUserById(Number(id)).subscribe({
        next: data => {
          this.user = data;
          this.loading = false;
          this.setFormValues(this.user)
        },
        error: (err) => {
          const error: ErrorMessageModel = err.error;

          this.messageService.add({closable: true, summary: error.message, severity: 'error'});
        }
      })
    }
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

  resetToDefault() {
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
