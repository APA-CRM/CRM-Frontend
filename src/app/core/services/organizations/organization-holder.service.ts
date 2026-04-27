import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrganizationHolderService {

  private readonly CURRENT_ORGANIZATION_ID_NAME: string = 'currentOrganizationId';
  private readonly CURRENT_ORGANIZATION_NAME_NAME: string = 'currentOrganizationName';
  private readonly USER_ORGANIZATION_IDS_NAME: string = 'userOrganizationIds';

  constructor() {
  }

  public setUserOrganizations(organizationIds: number[]): void {
    localStorage.setItem(this.USER_ORGANIZATION_IDS_NAME, JSON.stringify(organizationIds));
  }

  public setCurrentOrganization(organizationId: number, organizationName: string): void {
    localStorage.setItem(this.CURRENT_ORGANIZATION_ID_NAME, organizationId.toString());
    localStorage.setItem(this.CURRENT_ORGANIZATION_NAME_NAME, organizationName);
  }

  public getUserOrganizationIds(): number[] {
    let item = localStorage.getItem(this.USER_ORGANIZATION_IDS_NAME);

    return JSON.parse(item!);
  }

  public getOrganizationId(): number {
    return Number.parseInt(localStorage.getItem(this.CURRENT_ORGANIZATION_ID_NAME)!);
  }

  public getOrganizationName(): string {
    return localStorage.getItem(this.CURRENT_ORGANIZATION_NAME_NAME)!;
  }

  public isUserInOrganization(organizationId: number): boolean {
    let organizationIds = this.getUserOrganizationIds();

    return organizationIds.includes(organizationId);
  }

}
