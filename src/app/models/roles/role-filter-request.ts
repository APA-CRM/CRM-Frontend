import { BaseFilterRequest } from "../filter/base-filter-request";

export interface RoleFilterRequest extends BaseFilterRequest{
    name: string | null
}
