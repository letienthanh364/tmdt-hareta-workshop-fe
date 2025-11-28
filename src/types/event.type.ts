import { ProductType } from './product.type'
import { JSONModel, PagingType } from './utils.type'

export interface EventType extends JSONModel {
  overall_content: string
  detail_content: string
  date_start: string
  date_end: string
  discount: number
  avatar: string
  items: { item: ProductType }[]
}
export interface EventList {
  data: EventType[]
  paging: PagingType
}

export interface EventListConfig {
  page?: number | string
  limit?: number | string
}
