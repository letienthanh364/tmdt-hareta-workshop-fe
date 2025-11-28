import { NavLink } from 'react-router-dom'
import mainPath, { orderPath } from 'src/constants/path'
import { useViewport } from 'src/hooks/useViewport'
import { useContext } from 'react'
import { OrderContext } from 'src/contexts/order.context'

import { AppContext } from 'src/contexts/app.context'
import PathBar from 'src/components/PathBar'
import { useTranslation } from 'react-i18next'

import OrderPageDesktop from './children/OrderPageDesktop'
import OrderPageMobile from './children/OrderPageMobile'

export default function OrderPage() {
  const { orderList, tempOrderList } = useContext(OrderContext)
  const { isAuthenticated } = useContext(AppContext)

  const isMobile = useViewport().width < 768

  const purchaseList = isAuthenticated ? orderList : tempOrderList
  //! Handle bill
  const totalPrice = purchaseList.reduce((sum, purchase) => {
    return sum + purchase.quantity * purchase.item.original_price
  }, 0)
  const totalDiscountedPrice = purchaseList.reduce((val, purchase) => {
    return val + purchase.quantity * purchase.item.price
  }, 0)

  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <div className='bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'>
      <div className='container space-y-6'>
        <PathBar
          pathList={[
            { pathName: t('path.Cart'), url: mainPath.cart },
            { pathName: t('path.Order'), url: mainPath.order }
          ]}
        />

        <div className='space-y-6'>
          <p className='text-center text-xl font-semibold uppercase tracking-wider text-haretaColor tablet:text-2xl desktop:text-4xl'>
            {t('layout.Order')}
          </p>

          {!isMobile ? (
            <OrderPageDesktop
              purchaseList={purchaseList}
              totalPrice={totalPrice}
              totalDiscountedPrice={totalDiscountedPrice}
            />
          ) : (
            <OrderPageMobile
              purchaseList={purchaseList}
              totalPrice={totalPrice}
              totalDiscountedPrice={totalDiscountedPrice}
            />
          )}

          <div className='flex w-full justify-center'>
            <div className='flex w-full justify-between tablet:w-8/12 desktop:w-1/2'>
              <NavLink
                to={mainPath.cart}
                className='rounded-xl bg-unhoveringBg px-4 py-2 text-xs font-medium uppercase text-darkText hover:bg-hoveringBg tablet:text-sm desktop:text-base'
              >
                {t('bill.Back to cart')}
              </NavLink>
              <NavLink
                to={orderPath.checkout}
                className='rounded-xl bg-unhoveringBg px-4 py-2 text-xs font-medium uppercase text-darkText hover:bg-hoveringBg tablet:text-sm desktop:text-base'
              >
                {t('bill.Checkout')}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
