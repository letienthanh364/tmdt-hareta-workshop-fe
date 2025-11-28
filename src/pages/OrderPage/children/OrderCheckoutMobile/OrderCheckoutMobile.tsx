import OrderDetail from '../../components/OrderDetail'
import OrderPaymentPolicy from '../../components/OrderPaymentPolicy'
import OrderShippingInfor from '../../components/OrderShippingInfor'

export default function OrderCheckoutMobile() {
  return (
    <div className='space-y-4'>
      <OrderShippingInfor />
      <OrderPaymentPolicy />
      <div className='rounded-lg bg-white p-1 text-darkText dark:bg-black dark:text-lightText tabletSmall:p-2'>
        <OrderDetail />
      </div>
    </div>
  )
}
