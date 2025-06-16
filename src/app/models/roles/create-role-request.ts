import {ResourceWithActions} from "./resource-with-actions"

export interface RoleRequest {
  name: string
  resources: ResourceWithActions[]
}
