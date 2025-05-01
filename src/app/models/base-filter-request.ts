import { SortDirection } from "../core/enums/sort-direction"

export interface BaseFilterRequest {
    page: number
    size: number
    sortDirection: SortDirection
    sortBy: string | null
}
