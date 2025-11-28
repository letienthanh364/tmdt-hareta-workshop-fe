import { ProductType } from './product.type'
import { JSONModel } from './utils.type'

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
export type PurchaseListStatus = PurchaseStatus | 0

export interface Purchase extends JSONModel {
  quantity: number
  item: ProductType
}

export interface TemporaryPurchase {
  id: string
  quantity: number
  item: ProductType
}

export interface ExtendedPurchase extends Purchase {
  disabled: boolean
  checked: boolean
  previousQuantity: number
  discount: number
}

export interface PurchaseList {
  data: Purchase[]
  paging: {
    page: number
    limit: number
    total: number
    cursor: string
    next_cursor: string
  }
}
