import {UserModel} from "./user-model";
import {UserRolePreview} from "./user-role-preview";

export interface UserWithRolesModel extends UserModel {
  roles: UserRolePreview[]
}
