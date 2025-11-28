import OrderHeader from '../../components/OrderHeader'
import OrderDetail from '../../components/OrderDetail'
import { useContext } from 'react'
import { OrderContext } from 'src/contexts/order.context'
import orderScreens from 'src/constants/orderScreens'
import OrderShippingInfor from '../../components/OrderShippingInfor'
import OrderPaymentPolicy from '../../components/OrderPaymentPolicy'

export default function OrderCheckoutDesktop() {
  const { screen } = useContext(OrderContext)

  return (
    <div className='grid grid-cols-12 gap-4 desktop:gap-6'>
      <div className='col-span-7'>
        <OrderHeader />
        <div className='mt-4'>
          {screen == orderScreens.shipping && <OrderShippingInfor />}
          {screen == orderScreens.payment && <OrderPaymentPolicy />}
        </div>
      </div>

      <div className='col-span-5'>
        <div className='sticky top-14 rounded-xl bg-lightColor700 p-3 text-darkText duration-200 dark:bg-darkColor700 dark:text-lightText desktop:top-20 desktop:p-4'>
          <OrderDetail />
        </div>
      </div>
    </div>
  )
}
