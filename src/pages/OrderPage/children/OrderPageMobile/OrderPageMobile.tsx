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
const titleStyle = 'text-sm tabletSmall:text-base font-medium uppercase flex items-center justify-center'
const infoStyle = 'text-sm tabletSmall:text-base flex items-center justify-center'

export default function OrderPageMobile({ purchaseList, totalPrice, totalDiscountedPrice }: Props) {
  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-5 gap-2 desktop:gap-4'>
        <div className={classNames('col-span-2', titleStyle)}>{t('bill.Product')}</div>
        <div className={classNames('col-span-1', titleStyle)}>{t('bill.Unit price')}</div>
        <div className={classNames('col-span-2', titleStyle)}>{t('bill.Subtotal')}</div>
      </div>
      <div className='border-whit my-2 w-full border-t border-black/60 dark:border-white/60'></div>
      <div className='space-y-2'>
        {purchaseList.map((purchase) => {
          const isDiscounted = purchase.item.price < purchase.item.original_price

          return (
            <div key={purchase.id} className='grid w-full grid-cols-5 gap-2 py-2'>
              <div className={classNames('col-span-2 line-clamp-2', infoStyle)}>{purchase.item.name}</div>
              <div className={classNames(infoStyle, 'col-span-1 flex-col space-y-1')}>
                <p
                  className={classNames('', {
                    'line-through opacity-60': isDiscounted
                  })}
                >
                  ${formatCurrency(purchase.item.original_price)}
                </p>
                {isDiscounted && (
                  <p className='flex justify-center space-x-1'>${formatCurrency(purchase.item.price)}</p>
                )}
              </div>
              <div className={classNames('col-span-1 font-semibold', infoStyle)}>x{purchase.quantity}</div>
              <div className={classNames(infoStyle, 'col-span-1 flex-col space-y-1 font-semibold text-haretaColor')}>
                <p
                  className={classNames('', {
                    'line-through opacity-60': isDiscounted
                  })}
                >
                  ${formatCurrency(purchase.item.original_price * purchase.quantity)}
                </p>
                {isDiscounted && (
                  <p className='flex justify-center space-x-1'>
                    ${formatCurrency(purchase.item.price * purchase.quantity)}
                  </p>
                )}
              </div>

              <div className='col-span-6 flex items-center justify-center py-2'>
                <div className='w-8/12 border-t border-dashed border-black/60 dark:border-white/60 tablet:w-6/12 desktop:w-4/12' />
              </div>
            </div>
          )
        })}
      </div>

      <div className='space-y-2'>
        <div className={classNames('flex items-center justify-center py-2 text-center font-medium')}>
          {t('bill.Total')}
        </div>
        <div className={classNames('grid grid-cols-2 gap-2 text-sm')}>
          <p className='col-span-1 flex items-center'>{t('bill.Subtotal')}</p>
          <p className='col-span-1 font-medium'>${totalPrice}</p>
        </div>
        <div className={classNames('grid grid-cols-2 gap-2 text-sm')}>
          <p className='col-span-1 flex items-center'>{t('bill.Discount')}</p>
          <p className='col-span-1 font-medium'>${totalPrice - totalDiscountedPrice}</p>
        </div>
        <div className={classNames('grid grid-cols-2 gap-2 text-sm')}>
          <p className='col-span-1 flex items-center'>{t('bill.Discounted price')}</p>
          <p className='col-span-1 text-lg font-semibold text-haretaColor tabletSmall:text-xl'>
            ${totalDiscountedPrice}
          </p>
        </div>
      </div>

      <div className='col-span-8 flex items-center justify-center py-2'>
        <div className='w-10/12 border-t border-white/80 tablet:w-8/12 desktop:w-6/12'></div>
      </div>
    </div>
  )
}
