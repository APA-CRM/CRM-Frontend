import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrganizationHolderService {

  private organizationId!: number;

  constructor() {}

  public setOrganizationId(organizationId: number): void {
    this.organizationId = organizationId;
  }

  public getOrganizationId(): number {
    return this.organizationId;
  }

}
