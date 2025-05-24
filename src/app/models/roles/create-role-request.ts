import { ResourceWithActions } from "./resource-with-actions"

export interface CreateRoleRequest {
    name: string
    resources: ResourceWithActions[]
}
