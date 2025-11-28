import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Order } from 'src/types/order.type'
import { formatCurrency } from 'src/utils/utils'

interface Props {
  orderDetail: Order
  totalOriginalPrice: number
  totalPrice: number
}

//! Styles
const wrapperClassname = 'grid w-full grid-cols-1 gap-2 tablet:grid-cols-3 desktop:gap-4'
const titleClassname =
  'col-span-1 text-sm text-darkText/80 dark:text-lightText/80 tabletSmall:text-base desktop:text-lg'
const infoClassname = 'col-span-1 tablet:col-span-2 text-sm font-medium tabletSmall:text-base desktop:text-lg truncate'

export default function OrderTrackingOrderInfo({ orderDetail, totalOriginalPrice }: Props) {
  //! Multi languages
  const { t } = useTranslation('support')

  return (
    <div className='mt-2 grid grid-cols-1 gap-4 tablet:mt-4 tablet:grid-cols-2 desktop:mt-6 desktop:gap-6'>
      <div className='col-span-1 flex flex-col space-y-4 bg-lightColor900 p-4 dark:bg-darkColor900'>
        <p className='w-full text-lg font-semibold uppercase tablet:text-xl desktop:text-2xl'>
          {t('order information.customer information')}
        </p>
        <div className='flex w-full items-center justify-center rounded-2xl border-2 border-t border-black/80 dark:border-white/80' />

        <div className='flex flex-col space-y-2'>
          <div className={wrapperClassname}>
            <p className={titleClassname}>{t('order information.name')}</p>
            <p className={infoClassname}>{orderDetail?.name}</p>
          </div>
          <div className={wrapperClassname}>
            <p className={titleClassname}>{t('order information.email')}</p>
            <p className={infoClassname}>{orderDetail?.email}</p>
          </div>
          <div className={wrapperClassname}>
            <p className={titleClassname}>{t('order information.phone')}</p>
            <p className={infoClassname}>{orderDetail?.phone}</p>
          </div>
          <div className={wrapperClassname}>
            <p className={titleClassname}>{t('order information.address')}</p>
            <p
              className={classNames(
                'col-span-1 text-sm font-medium tabletSmall:text-base tablet:col-span-2 desktop:text-lg'
              )}
            >
              {orderDetail?.address}
            </p>
          </div>
        </div>
      </div>

      <div className={classNames('col-span-1 flex flex-col space-y-4 bg-lightColor900 p-4 dark:bg-darkColor900')}>
        <p className='w-full text-lg font-semibold uppercase tablet:text-xl desktop:text-2xl'>
          {t('order information.Payment')}
        </p>
        <div className='flex w-full items-center justify-center rounded-2xl border-2 border-t border-black/80 dark:border-white/80' />

        <div className='flex h-full flex-col justify-between space-y-6'>
          <div className='flex flex-col space-y-2'>
            <div className={wrapperClassname}>
              <p className={titleClassname}>{t('order information.Total')}</p>
              <p className={classNames(infoClassname)}>${formatCurrency(totalOriginalPrice)}</p>
            </div>

            <div className={wrapperClassname}>
              <p className={titleClassname}>{t('order information.Discount')}</p>
              <p className={classNames(infoClassname)}>${formatCurrency(totalOriginalPrice - orderDetail.total)}</p>
            </div>
          </div>

          <div className={classNames(wrapperClassname, 'text border-spacing-6 border-t border-dashed pt-6 ')}>
            <p className={classNames(titleClassname, 'font-semibold')}>{t('order information.Total payment')}</p>
            <p className={classNames(infoClassname, ' font-semibold text-haretaColor')}>${orderDetail.total}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
