import { Fragment, useContext } from 'react'
import EmptyProductList from 'src/components/EmptyProductList'
import OrderTrackingLoading from 'src/pages/OrderTrackingPage/components/OrderTrackingLoading'
import { AppContext } from 'src/contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import { orderApi } from 'src/apis/order.api'
import { useTranslation } from 'react-i18next'
import { ceil } from 'lodash'
import OrderTrackingOrderItem from '../../components/OrderTrackingOrderItem'
import UsePagination from 'src/components/UsePagination'
import useOrderListQueryConfig, { OrderListQueryConfig } from 'src/hooks/queryConfigs/useOrderListQueryConfig'

const LIMIT = 5 as const

export default function OrderTrackingForUser() {
  const { isAuthenticated } = useContext(AppContext)

  //! get order list
  const orderConfig: OrderListQueryConfig = { ...useOrderListQueryConfig(), limit: String(LIMIT) }

  const { data: orderData } = useQuery({
    queryKey: ['orders', orderConfig],
    queryFn: () => {
      return orderApi.getOrderList()
    },
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000
  })
  const orderList = orderData?.data.data || []

  //! Multi languages
  const { t } = useTranslation('support')

  return (
    <Fragment>
      <div className='rounded-lg border border-black/40 bg-lightColor700/60 px-2 py-4 dark:border-white/40 dark:bg-darkColor700/60 tablet:px-4 tablet:py-8 desktop:px-6 desktop:py-8 '>
        <p className='text-center text-lg font-bold uppercase tablet:text-xl desktop:text-2xl'>
          {t('orderDetail.title')}
        </p>

        {!orderData && <OrderTrackingLoading />}
        {orderData && orderData.data.paging.total == 0 && <EmptyProductList currentPage='order' />}
        {orderData && (
          <Fragment>
            <div className='mt-2 tablet:mt-3 desktop:mt-4'>
              {orderList?.map((order) => (
                <div
                  key={order.id}
                  className='dark:bg-dark mt-4 rounded-lg border border-black/40 bg-lightBg first:mt-0 hover:bg-lightColor900/60 dark:border-white/40 dark:bg-darkBg dark:hover:bg-darkColor900/60'
                >
                  <OrderTrackingOrderItem order={order} />
                </div>
              ))}
            </div>
            <div className=''>
              <UsePagination queryConfig={orderConfig} totalPage={ceil(orderData.data.paging.total / LIMIT)} />
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}
