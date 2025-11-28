import React, { Fragment } from 'react'
import { formatCurrency } from 'src/utils/utils'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'
import CartMobileTempPurchaseCard from '../../components/CartMobileTempPurchaseCard'
import { useTranslation } from 'react-i18next'
import { ExtendedPurchase } from 'src/types/cart.type'

interface Props {
  extendedTempPurchases: ExtendedPurchase[]
  handleChecking: (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectAll: () => void
  handleQuantity: (purchaseIndex: number, value: number, enable: boolean) => void
  handleTypeQuantity: (purchaseIndex: number) => (value: number) => void
  handleRemove: (purchaseIndex: number) => () => void
  handleCheckout: () => void
}

export default function CartMobileForGuest(props: Props) {
  const {
    extendedTempPurchases,
    handleChecking,
    handleQuantity,
    handleRemove,
    handleSelectAll,
    handleTypeQuantity,
    handleCheckout
  } = props

  const isAllChecked = extendedTempPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedTempPurchases.filter((purchase) => purchase.checked)
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
          {extendedTempPurchases.length > 0 ? (
            extendedTempPurchases?.map((purchase, index) => (
              <CartMobileTempPurchaseCard
                key={purchase.id}
                purchase={purchase}
                index={index}
                handleChecking={handleChecking}
                handleQuantity={handleQuantity}
                handleRemove={handleRemove}
                handleTypeQuantity={handleTypeQuantity}
              />
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
        <div className='grid w-full grid-cols-12 items-center justify-between rounded-sm px-2 py-2 shadow  desktopLarge:mx-4'>
          <div className=' col-span-1 flex flex-shrink-0 items-center'>
            {extendedTempPurchases.length > 0 && (
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
          <div className='col-span-7 flex items-center justify-center space-x-2'>
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
