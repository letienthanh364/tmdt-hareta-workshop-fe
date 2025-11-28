import { OrderList } from 'src/types/order.type'
import { ProductGroup, ProductGroupList } from 'src/types/product.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'auth/'

interface CreateProductForm {
  name: string
  group_id: string
  category: string
  collection: string
  type: string
  quantity: number
  original_price: number
  price: number
  product_line: string
  color: string
  description: string
}

export interface UpdateProductForm {
  id: string
  name?: string
  category?: string
  collection?: string
  type?: string
  color?: string
  product_line?: string
  description?: string
  original_price?: number
  price?: number
  quantity?: number
  discount?: number
  tag?: number
  like_count?: number
  sold?: number
  cron_status?: number
}

interface UpdateProductAvatarForm {
  item_id: string
  file: FormData
  color: string
}

export const adminProductGroupApi = {
  getProductGroups() {
    return http.get<ProductGroupList>(`${URL}group-item/`)
  },
  createProductGroup(body: { name: string }) {
    return http.post<SuccessRespone<ProductGroup>>(`${URL}group-item/`, body)
  },
  editProductGroup(id: string, name: string) {
    return http.put<SuccessRespone<string>>(`${URL}group-item`, { id: id, name: name })
  },
  deleteProductGroup(body: { id: string }) {
    return http.delete(`${URL}group-item/`, { data: body })
  }
}

export const adminProductApi = {
  createNewProduct(body: CreateProductForm) {
    return http.post(`${URL}item/`, body)
  },
  updateProduct(body: UpdateProductForm) {
    return http.put<SuccessRespone<string>>(`${URL}item/`, body)
  },
  setDefaultProduct(body: { id: string }) {
    return http.put<SuccessRespone<string>>(`${URL}item/default`, body)
  },
  uploadProductAvatar(body: { id: string; file: File }) {
    return http.put<SuccessRespone<string>>(`${URL}item/avatar`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteProduct(body: { id: string }) {
    return http.delete(`${URL}item/`, { data: body })
  }
}

export const adminProductImageApi = {
  addImage(body: UpdateProductAvatarForm) {
    return http.post<SuccessRespone<string>>(`item-image/`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteImage(body: { id: string }) {
    return http.delete(`item-image/`, { data: body })
  }
}

interface OrderListConfig {
  status: number
  page: number
  limit: number
}

export const adminOrderApi = {
  getOrderList(params: OrderListConfig) {
    return http.get<OrderList>(`${URL}order/admin`, { params })
  },
  updateOrder(body: { id: string; status: number }) {
    return http.put<SuccessRespone<string>>(`${URL}order/`, body)
  }
}
