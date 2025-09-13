import {OrganizationModel} from '../organizations/organization-model';

export interface FileOrganizationModel {
  id: string;
  fileId: string;
  organization: OrganizationModel;
  createdAt: Date;
  updatedAt: Date;
}
