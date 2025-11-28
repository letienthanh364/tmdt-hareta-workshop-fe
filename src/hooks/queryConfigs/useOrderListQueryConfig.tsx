import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from '../useQueryParams'
import { OrderListConfig } from 'src/types/order.type'

export type OrderListQueryConfig = {
  [key in keyof OrderListConfig]: string
}

export const ORDER_LIMIT = 20

export default function useOrderListQueryConfig() {
  const queryParams: OrderListQueryConfig = useQueryParams()
  const queryConfig: OrderListQueryConfig = omitBy(
    {
      status: queryParams.status,
      email: queryParams.email,
      page: queryParams.page || 1,
      limit: queryParams.limit || ORDER_LIMIT
    },
    isUndefined
  )
  return queryConfig
}
