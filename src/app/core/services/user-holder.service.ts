import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserHolderService {

  private readonly CURRENT_USER_ID: string = "currentUserId";

  public setCurrentUserId(userId: number): void {
    localStorage.setItem(this.CURRENT_USER_ID, userId.toString());
  }

  public getCurrentUserId(): number {
    return Number(localStorage.getItem(this.CURRENT_USER_ID));
  }

}
