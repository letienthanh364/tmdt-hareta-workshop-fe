import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'
import { ProductListConfig } from 'src/types/product.type'

export type ProductListQueryConfig = {
  [key in keyof ProductListConfig]: string
}

export const ITEM_LIMIT = 24

export default function useProductListQueryConfig() {
  const queryParams: ProductListQueryConfig = useQueryParams()
  const queryConfig: ProductListQueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || ITEM_LIMIT,
      name: queryParams.name,
      category: queryParams.category,
      collection: queryParams.collection,
      type: queryParams.type,
      product_line: queryParams.product_line,
      lower_price: queryParams.lower_price,
      upper_price: queryParams.upper_price,
      tag: queryParams.tag
    },
    isUndefined
  )
  return queryConfig
}
