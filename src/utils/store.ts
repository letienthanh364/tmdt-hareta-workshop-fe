import { ProductListQueryConfig } from 'src/hooks/useProductListQueryConfig'
import { ProductList } from 'src/types/product.type'

export const setFavouriteListToLS = (data: ProductList) => {
  localStorage.setItem('favourite_list', JSON.stringify(data))
}

export const getFavouriteListFromLS = () => {
  const data = localStorage.getItem('favourite_list')
  return data ? JSON.parse(data) : null
}

export const setCategoryFilteringToLS = (data: string) => {
  localStorage.setItem('category_filtering', data)
}

export const setCollectionFilteringToLS = (data: string) => {
  localStorage.setItem('collection_filtering', data)
}

export const setTypeFilteringToLS = (data: string) => {
  localStorage.setItem('type_filtering', data)
}

export const setQueryConfigToLS = (data: ProductListQueryConfig) => {
  localStorage.setItem('query_config', JSON.stringify(data))
}

export const getCategoryFilteringFromLS = () => {
  return localStorage.getItem('category_filtering') || 'All'
}

export const getCollectionFilteringFromLS = () => {
  return localStorage.getItem('collection_filtering') || 'All'
}

export const getTypeFilteringFromLS = () => {
  return localStorage.getItem('type_filtering') || 'All'
}

export const getQueryConfigFromLS = () => {
  const data = localStorage.getItem('query_config')
  return data ? JSON.parse(data) : {}
}

export const clearFileringFromLS = () => {
  localStorage.removeItem('category_filtering')
  localStorage.removeItem('collection_filtering')
  localStorage.removeItem('type_filtering')
}
