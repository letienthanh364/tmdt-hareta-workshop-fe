import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { Order } from 'src/types/order.type'
import { formatDate, generateNameId } from 'src/utils/utils'

interface Props {
  order: Order
}

export default function OrderTrackingNavigateToPayment({ order }: Props) {
  //! Multi languages
  const { t } = useTranslation('support')
  return (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <p className='text-center font-medium text-haretaColor'>
        {t('Order payment.Have you not yet completed the payment?')}
      </p>
      <Link
        to={`${mainPath.orderTracking}/${generateNameId({ name: formatDate(order.created_at), id: order.id })}/payment`}
        className='rounded-xl bg-unhoveringBg px-4 py-1.5 font-medium text-darkText hover:bg-hoveringBg'
      >
        {t('Order payment.Go to payment page')}
      </Link>
    </div>
  )
}
