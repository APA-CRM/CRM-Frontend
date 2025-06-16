import {Page} from "./page"

export interface PageModel<Type> {
  content: Type[]
  page: Page
}
