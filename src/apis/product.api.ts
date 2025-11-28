import { ProductList, ProductListConfig, ProductsInGroupConfig } from 'src/types/product.type'
import { ProductRespone, StoreRespone } from 'src/types/store.type'
import http from 'src/utils/http'

const URL = 'item'

const productApi = {
  getProductList(params: ProductListConfig) {
    return http.get<ProductList>(`${URL}/`, { params })
  },
  getProductsInGroup(params: ProductsInGroupConfig) {
    return http.get<ProductList>(`${URL}/group`, { params })
  },
  getProductDetail(id: string) {
    return http.get<ProductRespone>(`${URL}/${id}`)
  },
  getFilteringList(name: string, category?: string, collection?: string, type?: string) {
    const url = `${URL}/filter?field=${name}`
    let query = ''
    if (category) {
      query += `category:${category}`
    }
    if (collection) {
      query += `&collection:${collection}`
    }
    if (type) {
      query += `&type:${type}`
    }
    const params = {
      query: query
    }
    return http.get<StoreRespone>(url, { params })
  }
}

export default productApi
