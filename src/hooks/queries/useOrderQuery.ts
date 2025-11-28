import { useMutation, useQuery } from '@tanstack/react-query'
import { orderApi } from 'src/apis/order.api'
import { OrderListQueryConfig } from '../queryConfigs/useOrderListQueryConfig'
import { adminOrderApi } from 'src/apis/admin.api'

const useGetOrderList = (queryConfig: OrderListQueryConfig) => {
  return useQuery({
    queryKey: ['orders', queryConfig],
    queryFn: () => orderApi.getOrderListForAdmin(queryConfig),
    staleTime: 1000 * 60 * 5
  })
}

const useUpdateOrderMutation = () => {
  return useMutation({ mutationFn: adminOrderApi.updateOrder })
}

export const orderQuery = {
  useGetOrderList,
  mutation: {
    useUpdateOrderMutation
  }
}
