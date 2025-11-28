import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { formatCurrency } from 'src/utils/utils'
import CartDesktopTempPurchaseCard from '../../components/CartDesktopTempPurchaseCard'
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

export default function CartDesktopForGuest(props: Props) {
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

  //! Multi languages
  const { t } = useTranslation('cart')

  return (
    <div className=' mt-2 rounded-md border border-black/40 bg-lightColor900 dark:border-white/40 dark:bg-darkColor900'>
      <div className=''>
        <div className='grid grid-cols-6 rounded-sm px-8  py-4 text-base uppercase text-darkText  dark:text-lightText desktop:text-lg'>
          <div className='col-span-2'>
            <p className='line-clamp-1 flex-grow items-center justify-center truncate text-center font-medium text-darkText dark:text-lightText'>
              {t('content.Product')}
            </p>
          </div>
          <div className='col-span-1 overflow-hidden text-center'>{t('content.Unit price')}</div>
          <div className='col-span-1 overflow-hidden text-center'>{t('content.Quantity')}</div>
          <div className='col-span-1 overflow-hidden text-center'>{t('content.Subtotal')}</div>
          <div className='col-span-1 overflow-hidden text-center'>{t('content.Action')}</div>
        </div>
        <div className='mx-4 my-2 h-[400px] overflow-y-auto rounded-md bg-lightColor700 shadow outline outline-1 outline-black/40 dark:bg-darkColor700 dark:outline-white/40'>
          {extendedTempPurchases.length > 0 ? (
            extendedTempPurchases?.map((purchase, index) => (
              <CartDesktopTempPurchaseCard
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
      </div>
      <div className='grid grid-cols-6 items-center justify-between rounded-sm px-8 py-4'>
        <div className='col-span-2 grid grid-cols-3'>
          <div className='col-span-1 flex flex-shrink-0 items-center'>
            {extendedTempPurchases.length > 0 && (
              <Fragment>
                <input
                  name='all_are_selected'
                  type='checkbox'
                  className='h-5 w-5 accent-haretaColor'
                  checked={isAllChecked}
                  onChange={handleSelectAll}
                />

                <button
                  className='ml-2 appearance-none text-darkText ring-0 dark:text-lightText'
                  onClick={handleSelectAll}
                >
                  {t('content.Select all')}
                </button>
              </Fragment>
            )}
          </div>
          <div className='col-span-2 flex items-center text-center text-darkText dark:text-lightText'>
            {checkedPurchasesCount < 2
              ? `${checkedPurchasesCount} ${t('content.item is selected')}`
              : `${checkedPurchasesCount} ${t('content.items are selected')}`}
          </div>
        </div>
        <div className='col-span-4 grid grid-cols-4 items-center'>
          <div className='col-span-1'></div>

          <div className='col-span-1 items-center  text-right font-medium uppercase text-darkText dark:text-lightText'>
            {t('content.total')}:
          </div>
          <span className='col-span-1 text-center text-base font-medium text-haretaColor dark:text-haretaColor desktop:text-lg'>
            ${formatCurrency(totalCheckedPurchasesPrice)}
          </span>
          {checkedPurchasesCount === 0 && (
            <div className='col-span-1 flex h-10 cursor-not-allowed items-center justify-center truncate rounded-md border-none bg-haretaColor text-sm font-medium text-black opacity-40 desktop:text-base'>
              {t('content.Order')}
            </div>
          )}
          {checkedPurchasesCount > 0 && (
            <Link
              to={mainPath.order}
              onClick={handleCheckout}
              className='col-span-1 flex h-10 items-center justify-center rounded-md border-none bg-haretaColor text-sm font-medium text-black hover:bg-primaryColor  desktop:text-base'
            >
              {t('content.Order')}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
