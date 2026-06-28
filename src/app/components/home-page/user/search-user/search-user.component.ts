import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ErrorMessageModel} from '../../../../models/error/error-message-model';
import {UserService} from '../../../../core/services/user.service';
import {MessageService} from 'primeng/api';
import {UserModel} from '../../../../models/users/user-model';
import {SelectModule} from 'primeng/select';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-search-user',
  imports: [SelectModule, FormsModule],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchUserComponent,
      multi: true
    }
  ]
})
export class SearchUserComponent implements ControlValueAccessor {

  @Input() placeholder: string = "Search by full name";

  @Output() onUserSelected = new EventEmitter<number | null>();

  users: UserModel[] = [];
  loading = false;
  disabled = false;

  value: number | null = null;

  private timerId?: number;

  constructor(
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {
  }

  // TODO: Performance issue. The component fetches a user by ID. Consider caching the response.
  writeValue(userId: number | null): void {
    if (this.value === userId) return;

    this.value = userId;

    if (!userId) return;

    this.loading = true;

    this.userService.getUserById(userId).subscribe({
      next: user => {
        this.users = [user, ...this.users.filter(u => u.id !== user.id)];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onUserSelectedChange(event: any): void {
    const userId = event?.value ?? null;

    this.value = userId

    this.onUserSelected.emit(userId);
    this.onChange(userId);
    this.onTouched();
  }

  onFilterUsers(event: any): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = window.setTimeout(() => {
      this.findUsersByFullName(event.filter);
    }, 500);
  }

  protected onClear() {
    this.value = null;

    this.onUserSelected.emit(this.value);
    this.onChange(this.value);
    this.onTouched();
  }

  private onChange: (value: number | null) => void = () => {
  };

  private onTouched: () => void = () => {
  };

  private findUsersByFullName(value: string): void {
    if (!value) {
      return;
    }

    this.loading = true;

    this.userService.getUsersByFullName(value).subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        const error: ErrorMessageModel = err.error;

        this.messageService.add({
          closable: true,
          summary: error.message,
          severity: 'error'
        });

        this.loading = false;
      }
    });
  }
}
