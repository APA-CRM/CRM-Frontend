import {BaseFilterRequest} from "../filter/base-filter-request";
import {DateRange} from "../filter/date-range";

export interface UsersFilterRequest extends BaseFilterRequest {
  login: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  createdDate: DateRange | null
  updatedDate: DateRange | null
  rolesId: number[]
}
