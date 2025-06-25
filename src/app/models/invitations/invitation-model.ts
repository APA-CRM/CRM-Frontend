import {OrganizationModel} from '../organizations/organization-model';
import {InvitationStatus} from '../../core/enums/invitation-status';

export interface InvitationModel {
  id: string
  organization: OrganizationModel
  userId: number
  status: InvitationStatus
  invitorId: number
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
}
