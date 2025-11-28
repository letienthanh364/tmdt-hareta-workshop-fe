import React, { Fragment, useContext } from 'react'
import { CartContext } from 'src/contexts/cart.context'
import { formatCurrency } from 'src/utils/utils'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'
import CartMobilePurchaseCard from '../../components/CartMobilePurchaseCard'
import { useTranslation } from 'react-i18next'

interface Props {
  handleChecking: (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectAll: () => void
  handleRemove: (purchaseIndex: number) => () => void
  handleCheckout: () => void
}

export default function CartMobileForUser(props: Props) {
  const { handleChecking, handleRemove, handleSelectAll, handleCheckout } = props

  const { extendedPurchases } = useContext(CartContext)
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasesPrice = checkedPurchases.reduce((result, purchase) => {
    return result + purchase.item.price * purchase.quantity * ((100 - purchase.discount) / 100)
  }, 0)

  //! Multi languagues
  const { t } = useTranslation('cart')

  return (
    <Fragment>
      <div className='relative'>
        <div className='grid grid-cols-12 rounded-md border border-black/20 bg-lightColor900 px-4 py-2 text-base font-medium uppercase text-darkText dark:border-white/20 dark:bg-darkColor900 dark:text-lightText desktop:text-lg'>
          <div className='col-span-1'></div>
          <div className='col-span-5 text-center'>{t('content.Product')}</div>
          <div className='col-span-5 text-center'>{t('content.Price')}</div>
          <div className='col-span-1'></div>
        </div>
        <div className='my-2 h-[460px] overflow-auto overscroll-contain rounded-md border border-black/20 bg-lightColor900 p-2 dark:border-white/20 dark:bg-darkColor900'>
          {extendedPurchases.length > 0 ? (
            extendedPurchases?.map((purchase, index) => (
              <div
                key={purchase.id}
                className='mt-2 flex items-center rounded-lg border border-black/10 bg-lightColor700 p-2 text-center text-darkText first:mt-0 dark:border-white/10 dark:bg-darkColor700 dark:text-lightText'
              >
                <CartMobilePurchaseCard
                  handleChecking={handleChecking}
                  handleRemove={handleRemove}
                  index={index}
                  purchase={purchase}
                />
              </div>
            ))
          ) : (
            <div className='relative h-full w-full'>
              <img
                src='/images/emptyCart.png'
                alt='Empty cart'
                className='absolute left-0 top-0 h-full w-full object-scale-down'
              />
            </div>
          )}
        </div>
        <div className='grid w-full grid-cols-12 items-center justify-between rounded-sm py-2 shadow'>
          <div className='col-span-1 flex flex-shrink-0 items-center'>
            {extendedPurchases.length > 0 && (
              <input
                name='all_are_selected'
                type='checkbox'
                className='h-5 w-5 accent-haretaColor'
                checked={isAllChecked}
                onChange={handleSelectAll}
              />
            )}
          </div>
          <div className='col-span-1 flex items-center justify-center text-darkText dark:text-lightText'>
            ({checkedPurchasesCount})
          </div>
          <div className='col-span-7 flex items-center justify-center space-x-2 text-sm font-medium tabletSmall:text-base'>
            <div className='col-span-1 items-center text-right uppercase text-darkText dark:text-lightText'>
              {t('content.total')}:
            </div>
            <span className='col-span-1 text-center font-medium text-primaryColor'>
              ${formatCurrency(totalCheckedPurchasesPrice)}
            </span>
          </div>
          {checkedPurchasesCount === 0 && (
            <div className='col-span-3 flex h-8 w-full cursor-not-allowed items-center justify-center rounded-md border-none bg-haretaColor text-center text-xs font-medium uppercase text-darkText opacity-40 tabletSmall:text-sm'>
              {t('content.Order')}
            </div>
          )}
          {checkedPurchasesCount > 0 && (
            <Link
              to={mainPath.order}
              onClick={handleCheckout}
              className='col-span-3 flex h-8 w-full items-center justify-center rounded-md border-none bg-haretaColor text-center text-xs font-medium uppercase text-darkText hover:bg-primaryColor tabletSmall:text-sm'
            >
              {t('content.Order')}
            </Link>
          )}
        </div>
      </div>
    </Fragment>
  )
}
