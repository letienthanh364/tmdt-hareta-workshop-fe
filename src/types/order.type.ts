import { JSONModel, PagingType } from './utils.type'

export interface Order extends JSONModel {
  name: string
  phone: string
  email: string
  address: string
  total: number
  payment_status: number
}

export interface OrderList {
  data: Order[]
  paging: PagingType
}

export interface OrderPurchaseListConfig {
  order_id: string
  page: number | string
  limit: number | string
}

export interface OrderListConfig {
  status?: number | string
  email?: string
  page?: number | string
  limit?: number | string
}
