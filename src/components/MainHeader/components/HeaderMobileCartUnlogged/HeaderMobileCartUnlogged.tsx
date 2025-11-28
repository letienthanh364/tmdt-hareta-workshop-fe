import { faCartShopping, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useContext } from 'react'
import { CartContext } from 'src/contexts/cart.context'
import useClickOutside from 'src/hooks/useClickOutside'
import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import { setTemporaryPurchasesToLS } from 'src/utils/cartInLS'
import HeaderPurchaseCard from '../HeaderPurchaseCard'

interface Props {
  wrapperStyle: string
  navigatorBtnStyle: string
}

export default function HeaderMobileCartUnlogged({ navigatorBtnStyle, wrapperStyle }: Props) {
  const { theme } = useContext(AppContext)
  const { temporaryPurchases, setTemporaryPurchases } = useContext(CartContext)

  const { visible, setVisible, ref } = useClickOutside(false)
  const openCart = () => {
    setVisible(true)
  }
  const closeCart = () => {
    setVisible(false)
  }

  const handleRemove = (purchaseIndex: number) => () => {
    const purchaseId = temporaryPurchases[purchaseIndex].id
    const newPurchaseList = temporaryPurchases.filter((purchase) => purchase.id !== purchaseId)
    setTemporaryPurchases(newPurchaseList)
    setTemporaryPurchasesToLS(newPurchaseList)
  }

  //! Multi languages
  const { t } = useTranslation('header')

  return (
    <div>
      <button onClick={openCart} className='relative flex items-end text-darkText dark:text-lightText'>
        <FontAwesomeIcon icon={faCartShopping} className='h-6 w-6 text-darkText dark:text-lightText' />
        {temporaryPurchases.length > 0 && (
          <span className='absolute -top-1 left-4 flex h-4 w-4 items-center justify-center rounded-full bg-haretaColor text-xs text-darkText'>
            {temporaryPurchases.length}
          </span>
        )}
      </button>
      <AnimatePresence>
        {visible && (
          <Fragment>
            <motion.div
              className='fixed inset-0'
              initial={{ opacity: 0, backgroundColor: 'black' }}
              animate={{
                opacity: 0.4
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className='absolute left-0 top-0 z-10 w-full self-center rounded-b-lg  shadow-sm tabletSmall:left-[calc(50%-200px)] tabletSmall:w-[400px]'
              initial={{ opacity: 0, y: '-20%' }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundColor: theme === 'dark' ? '#1d1d22' : '#fbfbff',
                color: theme === 'dark' ? '#eeeeee' : '#111111'
              }}
              exit={{ opacity: 0, y: '-20%' }}
              transition={{ duration: 0.3 }}
              ref={ref}
            >
              <button className='flex w-full cursor-pointer items-center justify-center py-2' onClick={closeCart}>
                <FontAwesomeIcon icon={faChevronUp} />
              </button>

              <div className='mx-3 border-b-[1px] border-gray-600 border-t-transparent dark:border-gray-400' />

              <Fragment>
                <div className='px-3 py-2 text-base normal-case text-gray-500 dark:text-gray-300 desktop:text-lg'>
                  <span className='text-haretaColor'>{temporaryPurchases.length} </span>
                  <span className=''>{t('cart button.items in cart')}</span>
                </div>
                <div className={wrapperStyle}>
                  {temporaryPurchases.length > 0 ? (
                    temporaryPurchases.map((purchase, index) => (
                      <HeaderPurchaseCard key={purchase.id} purchase={purchase} handleRemove={handleRemove(index)} />
                    ))
                  ) : (
                    <div className='relative h-full w-full'>
                      <img
                        src='/images/emptyCart.png'
                        alt='Empty cart'
                        className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/3 object-scale-down'
                      />
                    </div>
                  )}
                </div>
              </Fragment>

              <div className='mx-3 flex items-center justify-between py-2 text-xs tabletSmall:text-sm'>
                <div className='flex space-x-2'>
                  <NavLink to={mainPath.store} className={navigatorBtnStyle} onClick={closeCart}>
                    {t('cart button.store')}
                  </NavLink>
                </div>
                <div>
                  <NavLink to={mainPath.cart} className={navigatorBtnStyle} onClick={closeCart}>
                    {t('cart button.enter cart')}
                  </NavLink>
                </div>
              </div>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>
    </div>
  )
}
