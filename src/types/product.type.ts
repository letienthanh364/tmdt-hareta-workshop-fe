import { JSONModel, PagingType } from './utils.type'

export interface ProductGroup {
  id: string
  status: number
  created_at: string
  updated_at: string
  name: string
}

export interface ProductGroupList {
  data: ProductGroup[]
  paging: {
    page: number
    limit: number
    total: number
    cursor: string
    next_cursor: string
  }
}

export interface ProductAvatar {
  id: string
  status: number
  created_at: string
  updated_at: string
  url: string
  file_name: string
  width: number
  height: number
  cloud_name: string
  extension: string
}

export interface ProductType extends JSONModel {
  name: string
  category: string
  quantity: number
  discount: number
  description: string
  collection: string
  type: string
  original_price: number
  price: number
  sold: number
  tag: number
  cron_status: number
  like_count: number
  product_line: string
  avatar: ProductAvatar
  color: string
  default: boolean
  group: ProductGroup
}

export interface ProductList {
  data: ProductType[]
  paging: PagingType
}

export interface ProductListConfig {
  id?: string
  page?: number | string
  limit?: number | string
  name?: string
  category?: string
  collection?: string
  type?: string
  product_line?: string
  lower_price?: number | string
  upper_price?: number | string
  tag?: number | string
}

export interface ProductsInGroupConfig {
  id: string
  page: number | string
  limit: number | string
}

export interface FavouriteListConfig {
  page: number
  limit: number
}
