import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { ExtendedPurchase } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'

interface Props {
  purchaseList: ExtendedPurchase[]
  totalPrice: number
  totalDiscountedPrice: number
}

//! Styles
const titleStyle = 'text-center text-sm tablet:text-base font-semibold uppercase desktop:text-xl'
const infoStyle = 'text-center text-sm tablet:text-base desktop:text-lg'

export default function OrderPageDesktop({ purchaseList, totalPrice, totalDiscountedPrice }: Props) {
  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <div className='space-y-6'>
      <div className='space-y-4 py-4'>
        <div className='grid grid-cols-8 gap-2 desktop:gap-4'>
          <div className={classNames('col-span-3', titleStyle)}>{t('bill.Product')}</div>
          <div className={classNames('col-span-1', titleStyle)}>{t('bill.Unit price')}</div>
          <div className={classNames('col-span-1', titleStyle)}>{t('bill.Quantity')}</div>
          <div className={classNames('col-span-1', titleStyle)}>{t('bill.Subtotal')}</div>
          <div className={classNames('col-span-1', titleStyle)}>{t('bill.Discount')}</div>
          <div className={classNames('col-span-1', titleStyle)}>{t('bill.Discounted price')}</div>
        </div>
        {purchaseList.map((purchase, index) => (
          <div key={purchase.id} className='grid grid-cols-8 gap-2 py-2 desktop:gap-4 desktop:py-4'>
            <div className={classNames('col-span-3', infoStyle)}>{purchase.item.name}</div>
            <div className={classNames('col-span-1', infoStyle)}>${purchase.item.original_price}</div>
            <div className={classNames('col-span-1 font-semibold', infoStyle)}>{purchase.quantity}</div>
            <div className={classNames('col-span-1', infoStyle)}>
              ${formatCurrency(purchase.quantity * purchase.item.original_price)}
            </div>
            <div className={classNames('col-span-1', infoStyle)}>
              $
              {formatCurrency(
                purchase.quantity * purchase.item.original_price - purchase.quantity * purchase.item.price
              )}
            </div>
            <div className={classNames('col-span-1 font-semibold text-haretaColor', infoStyle)}>
              ${formatCurrency(purchase.quantity * purchase.item.price)}
            </div>

            {index != purchaseList.length - 1 && (
              <div className='col-span-8 flex items-center justify-center py-2'>
                <div className='w-8/12 border-t border-dashed border-white/60 tablet:w-6/12 desktop:w-4/12' />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-8 gap-2 tablet:text-lg desktop:gap-4 desktop:text-2xl'>
        <div className={classNames('col-span-5 text-center')}>{t('bill.Total')}</div>

        <div className={classNames('col-span-1 text-center')}>${totalPrice}</div>
        <div className={classNames('col-span-1 text-center')}>${totalPrice - totalDiscountedPrice}</div>
        <div className={classNames('col-span-1 text-center font-semibold text-haretaColor')}>
          ${totalDiscountedPrice}
        </div>
      </div>

      <div className='col-span-8 flex items-center justify-center py-2'>
        <div className='w-10/12 border-t border-white/80 tablet:w-8/12 desktop:w-6/12'></div>
      </div>
    </div>
  )
}
