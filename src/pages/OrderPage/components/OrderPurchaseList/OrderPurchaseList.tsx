import classNames from 'classnames'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ExtendedPurchase } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'

interface Props {
  purchaseList: ExtendedPurchase[]
}

export default function OrderPurchaseList({ purchaseList }: Props) {
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
    <Fragment>
      <div className='max-h-60 overflow-auto'>
        {purchaseList.map((purchase, index) => {
          const isDiscounted = purchase.item.price < purchase.item.original_price
          return (
            <div className='relative grid grid-cols-3 items-center gap-2 py-3 desktopLarge:py-4' key={purchase.id}>
              <div className='col-span-2'>
                <p className='truncate text-lg font-bold capitalize desktopLarge:text-xl'>{purchase.item.name}</p>
                <p className='text-sm capitalize desktopLarge:text-base'>{purchase.item.color}</p>
              </div>
              <div className='col-span-1 text-right'>
                <p className='flex justify-end space-x-2 text-base font-medium desktopLarge:text-lg'>
                  <span className={classNames('', { 'line-through opacity-60': isDiscounted })}>
                    ${purchase.item.original_price}
                  </span>
                  {isDiscounted && <span className=''>${purchase.item.price}</span>}
                </p>
                <p className='text-sm desktopLarge:text-base'>x {purchase.quantity}</p>
              </div>
              {index !== 0 && (
                <div className='absolute left-1/2 top-0 w-1/6 -translate-x-1/2 border-t border-dashed border-black/60 dark:border-white/60'></div>
              )}
            </div>
          )
        })}
      </div>
      <div className='my-4 w-full border border-dashed border-black/80 dark:border-white/80'></div>
      <div className=' space-y-2 text-lg font-semibold desktopLarge:text-xl'>
        <div className='grid grid-cols-3 gap-2'>
          <div className='col-span-2 text-darkText/80 dark:text-lightText/80'>{t('layout.Total')}</div>
          <div className='col-span-1 text-right text-haretaColor dark:text-haretaColor'>
            ${formatCurrency(totalPrice)}
          </div>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <div className='col-span-2 text-darkText/80 dark:text-lightText/80'>{t('layout.Discount')}</div>
          <div className='col-span-1 text-right text-haretaColor dark:text-haretaColor'>
            ${formatCurrency(totalPrice - totalDiscountedPrice)}
          </div>
        </div>
      </div>
      <div className='my-4 w-full border border-dashed border-black/80 dark:border-white/80'></div>
      <div className='grid grid-cols-3 gap-2 text-xl font-bold uppercase desktopLarge:text-2xl'>
        <div className='col-span-2 text-darkText/80 dark:text-lightText/80'>{t('layout.Bill')}</div>
        <div className='col-span-1 text-right text-haretaColor dark:text-haretaColor'>
          ${formatCurrency(totalDiscountedPrice)}
        </div>
      </div>
    </Fragment>
  )
}
