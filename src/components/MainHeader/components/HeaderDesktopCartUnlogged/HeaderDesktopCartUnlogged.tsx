import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { CartContext } from 'src/contexts/cart.context'
import HeaderPurchaseCard from '../HeaderPurchaseCard'
import { setTemporaryPurchasesToLS } from 'src/utils/cartInLS'
import FloatingOnClick from 'src/components/FoatingOnClick'

function PopoverSection() {
  const { temporaryPurchases, setTemporaryPurchases } = useContext(CartContext)

  const handleRemove = (purchaseIndex: number) => () => {
    const purchaseId = temporaryPurchases[purchaseIndex].id
    const newPurchaseList = temporaryPurchases.filter((purchase) => purchase.id !== purchaseId)
    setTemporaryPurchases(newPurchaseList)
    setTemporaryPurchasesToLS(newPurchaseList)
  }

  //! Multi languages
  const { t } = useTranslation('header')

  return (
    <div className='relative -top-1 w-[360px] rounded-xl bg-lightColor700 py-2 text-sm text-darkText shadow-md dark:bg-darkColor700 dark:text-lightText desktop:top-0'>
      <Fragment>
        <div className='flex space-x-1.5 px-3 py-1 text-base desktop:text-lg'>
          <span className='text-haretaColor'>{temporaryPurchases.length}</span>
          <span className='text-gray-500 dark:text-gray-300'>{t('cart button.items in cart')}</span>
        </div>

        <div className='m-2 overflow-y-auto overflow-x-hidden rounded-md bg-lightColor900 outline outline-1 outline-black/20 dark:bg-darkColor900 dark:outline-white/20'>
          {temporaryPurchases.length > 0 ? (
            <div className='max-h-[360px] min-h-[240px] overflow-y-auto'>
              {temporaryPurchases.map((tempPurchase, index) => {
                return (
                  <HeaderPurchaseCard
                    key={tempPurchase.id}
                    purchase={tempPurchase}
                    handleRemove={handleRemove(index)}
                  />
                )
              })}
            </div>
          ) : (
            <div className=''>
              <img src='/images/empty_cart.png' alt='Empty cart' className='m-2' />
            </div>
          )}
        </div>
      </Fragment>

      <div className='mx-3 mb-2 mt-4 flex items-center justify-between font-medium text-black'>
        <NavLink to={mainPath.store}>
          <button className='justify-self-start rounded-md bg-haretaColor px-4 py-1 text-sm hover:bg-primaryColor '>
            {t('cart button.store')}
          </button>
        </NavLink>
        <NavLink to={mainPath.cart}>
          <button className='justify-self-start rounded-md bg-haretaColor px-4 py-1 text-sm hover:bg-primaryColor'>
            {t('cart button.enter cart')}
          </button>
        </NavLink>
      </div>
      <div className='absolute -top-4 right-0 h-4 w-1/4 bg-none'></div>
    </div>
  )
}

export default function HeaderDesktopCartUnlogged() {
  const { temporaryPurchases } = useContext(CartContext)

  //! Handle floating
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className='rounded-lg bg-unhoveringBg hover:bg-hoveringBg'>
      <FloatingOnClick
        className='flex border border-none px-1.5 py-1 desktop:px-2'
        renderPopover={<PopoverSection />}
        placement='bottom-end'
        offsetValue={12}
        isOpen={isOpen}
        openChange={setIsOpen}
      >
        <div className='flex items-center space-x-2 px-2 py-0.5 text-black'>
          <FontAwesomeIcon icon={faCartShopping} className='' />
          {temporaryPurchases.length > 0 && (
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-medium text-darkText desktop:text-sm desktopLarge:text-base'>
              {temporaryPurchases.length}
            </div>
          )}
        </div>
      </FloatingOnClick>
    </div>
  )
}
