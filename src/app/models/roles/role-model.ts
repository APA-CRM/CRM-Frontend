import { AccessControl } from "./access-control"

export interface RoleModel {
    id: number
    name: string
    accessControls: AccessControl[]
    createdAt: Date
    updateAt: Date
}
