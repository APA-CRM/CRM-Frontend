import { BaseFilterRequest } from "./base-filter-request";
import { DateRange } from "./date-range";

export interface UsersFilterRequest extends BaseFilterRequest{
    login: string
    email: string
    firstName: string
    lastName: string
    createDate: DateRange
    updatedDate: DateRange
    organizationId: number
}
