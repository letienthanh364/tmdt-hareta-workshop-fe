import { PagingType } from './utils.type'

export interface ProductImage {
  id: string
  status: number
  created_at: string
  updated_at: string
  color: string
  image: {
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
}

export interface ProductImageListConfig {
  id: string
  page: number | string
  limit: number | string
}

export interface ProductImageListRespone {
  data: ProductImage[]
  paging: PagingType
}
