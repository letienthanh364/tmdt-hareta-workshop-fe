import { Fragment, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { orderTrackingPath } from 'src/constants/path'
import { getIdFromNameId } from 'src/utils/utils'
import { orderApi } from 'src/apis/order.api'
import { useQuery } from '@tanstack/react-query'
import { OrderPurchaseListConfig } from 'src/types/order.type'
import LoadingRing from 'src/components/LoadingRing'
import { AppContext } from 'src/contexts/app.context'
import OrderTrackingOrderInfo from '../../components/OrderTrackingOrderInfo'
import OrderTrackingPurchaseCard from '../../components/OrderTrackingPurchaseCard'
import PathBar from 'src/components/PathBar'
import OrderTrackingOrderStatus from '../../components/OrderTrackingOrderStatus'

export default function OrderTrackingOrderDetail() {
  const { isAuthenticated } = useContext(AppContext)

  //! Get order id and url
  const currentUrl = useLocation().pathname
  const { orderId: paramOrderId } = useParams()
  const orderId = getIdFromNameId(paramOrderId as string)

  //! Get order information
  const { data: orderData } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => {
      return isAuthenticated ? orderApi.findOrderForUser(orderId) : orderApi.findOrderForGuest(orderId)
    },

    staleTime: 3 * 60 * 1000
  })
  const orderDetail = orderData?.data.data

  // //! Get purchase list
  const itemOrderListConfig: OrderPurchaseListConfig = {
    order_id: orderId,
    page: 1,
    limit: 5
  }
  const { data: purchasesData, isLoading: loadingPurchasesData } = useQuery({
    queryKey: ['orders', orderId, 'purchases'],
    queryFn: () => {
      return isAuthenticated
        ? orderApi.getPurchaseListOfOrderForUser(itemOrderListConfig)
        : orderApi.getPurchaseListOfOrderForGuest(itemOrderListConfig)
    },

    staleTime: 3 * 60 * 1000
  })
  const purchaseList = purchasesData?.data.data || []

  //! Handle order detail
  const totalOriginalPrice = purchaseList.reduce((sum, purchase) => {
    return sum + purchase.quantity * purchase.item.original_price
  }, 0)
  const totalPrice = purchaseList.reduce((sum, purchase) => {
    return sum + purchase.quantity * purchase.item.price
  }, 0)

  //! Multi languages
  const { t } = useTranslation('support')

  return (
    <div className='bg-lightBg py-2 text-darkText duration-200 dark:bg-darkBg dark:text-lightText tablet:py-3 desktop:py-4'>
      <div className='container'>
        <PathBar
          pathList={[
            { pathName: t('path.order tracking'), url: orderTrackingPath.orderTracking },
            { pathName: orderId, url: currentUrl }
          ]}
        />

        <div className='space-y-6 py-2 tabletSmall:py-4 tablet:py-6 desktop:py-8'>
          <p className='w-full text-center text-lg font-bold uppercase text-haretaColor tablet:text-2xl desktop:text-4xl'>
            {t('order information.order information')}
          </p>
          <div className='flex w-full items-center justify-center'>
            <div className='w-full rounded-xl border border-black dark:border-white tablet:w-8/12 desktop:w-1/2'></div>
          </div>
          {!orderDetail && (
            <div className='flex h-96 w-full items-center justify-center py-1 tablet:py-2 desktop:py-4'>
              <LoadingRing />
            </div>
          )}
          {orderDetail && (
            <div className='space-y-6'>
              <OrderTrackingOrderStatus orderDetail={orderDetail} />

              <OrderTrackingOrderInfo
                orderDetail={orderDetail}
                totalOriginalPrice={totalOriginalPrice}
                totalPrice={totalPrice}
              />

              <div className='space-y-4 px-1 py-2 tablet:mt-6 tablet:py-4 desktop:mt-8 '>
                <p className='w-full text-center text-lg font-semibold uppercase tablet:text-xl desktop:text-2xl'>
                  {t('order information.Product list')}
                </p>
                <div className='flex w-full items-center justify-center'>
                  <div className='w-full rounded-2xl border-2 border-t border-black/80 dark:border-white/80 tablet:w-8/12 desktop:w-6/12' />
                </div>

                {(loadingPurchasesData || !purchasesData) && (
                  <div className='flex h-96 w-full items-center justify-center py-1 tablet:py-2 desktop:py-4'>
                    <LoadingRing />
                  </div>
                )}
                {purchasesData && (
                  <Fragment>
                    <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2'>
                      {purchasesData &&
                        purchaseList.map((purchase) => (
                          <OrderTrackingPurchaseCard key={purchase.id} purchase={purchase} />
                        ))}
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
