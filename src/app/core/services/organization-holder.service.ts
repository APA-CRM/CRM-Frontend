import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrganizationHolderService {

  private readonly ORGANIZATION_ID_NAME: string = 'organizationId';

  constructor() {
  }

  public setOrganizationId(organizationId: number): void {
    localStorage.setItem(this.ORGANIZATION_ID_NAME, organizationId.toString());
  }

  public getOrganizationId(): number {
    return Number.parseInt(localStorage.getItem(this.ORGANIZATION_ID_NAME)!);
  }

}
