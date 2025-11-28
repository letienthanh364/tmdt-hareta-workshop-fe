import { FloatingOverlay, FloatingPortal } from '@floating-ui/react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { CartContext } from 'src/contexts/cart.context'
import useClickOutside from 'src/hooks/useClickOutside'
import { ProductType } from 'src/types/product.type'
import useAddToTempCartAndQuickOrder from 'src/hooks/useAddToTempCartAndQuickOrder'

interface Props {
  action: string
  activeProduct: ProductType
  setActiveProduct: React.Dispatch<React.SetStateAction<ProductType>>
  productsInGroup: ProductType[]
  elementRef: React.RefObject<HTMLDivElement>
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  handleAddToCart: (itemID: string, quantity: number) => void
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setErrorDialog: React.Dispatch<React.SetStateAction<boolean>>
  setOrderingDialog: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProductMobileActionDialog({
  action,
  activeProduct,
  productsInGroup,
  setVisible,
  elementRef,
  handleAddToCart,
  setActiveProduct,
  setDialogIsOpen,
  setErrorDialog,
  setOrderingDialog
}: Props) {
  const currentDateString = Date.now().toString()
  const { isAuthenticated, theme } = useContext(AppContext)
  const { temporaryPurchases } = useContext(CartContext)

  const [activeProductID, setActiveProductID] = useState<string>(activeProduct.id)

  const { visible: createTempCart, ref: createDialogRef, setVisible: setCreateTempCart } = useClickOutside(false)

  //! Get product data
  const { data: productDetailData, isLoading } = useQuery({
    queryKey: ['products', 'detail', activeProductID],
    queryFn: () => productApi.getProductDetail(activeProductID),

    staleTime: 3 * 60 * 1000
  })
  const item = productDetailData?.data.data

  //! Choose variant
  const handleChooseVariant = (product: ProductType) => () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setQuantity(1)
    setActiveProductID(product.id)
    setActiveProduct(product)
  }

  //! Add to user cart
  const [quantity, setQuantity] = useState<number>(1)
  const handleQuantity = (value: number) => {
    setQuantity(value)
  }

  const addToCart = () => {
    handleAddToCart(activeProductID, quantity)
    setVisible(false)
  }

  const closeAddToCart = () => {
    setVisible(false)
  }

  const avatarURL = item?.avatar ? item.avatar.url : null

  //! Handle add to temporary cart and handle quick order
  const { addToTemporaryCart, createTemporaryCart, handleOrder } = useAddToTempCartAndQuickOrder({
    activeProduct,
    quantity,
    currentDateString,
    setQuantity,
    setVisible,
    setDialogIsOpen,
    setErrorDialog,
    setOrderingDialog,
    setCreateTempCart
  })

  //! Multi languages
  const { t } = useTranslation('productdetail')

  if (!item) return null
  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll className={theme === 'dark' ? 'dark' : 'light'}>
        <div className='fixed inset-0 bg-black bg-opacity-80' />

        <div
          ref={elementRef}
          className={classNames(
            'fixed left-1/2 top-1/2 flex w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-black/40 px-2 py-4 shadow-sm dark:border-white/40 tabletSmall:w-[60%] ',
            {
              'bg-white text-darkText ': theme === 'light',
              'bg-black text-lightText': theme === 'dark'
            }
          )}
        >
          <div className='flex items-start'>
            <div className=' grid grow grid-cols-3'>
              <div className='relative col-span-1 w-full overflow-hidden border border-black/40 pt-[100%] dark:border-white/40'>
                {isLoading && (
                  <Skeleton
                    variant='rounded'
                    className='absolute left-0 top-0 dark:bg-white/10'
                    width={'100%'}
                    height={'100%'}
                  />
                )}
                {!isLoading && (
                  <img
                    src={avatarURL || ''}
                    alt={item.name}
                    className='pointer-events-none absolute left-0 top-0 h-full w-full object-scale-down'
                  />
                )}
              </div>
              <div className='col-span-2 ml-4 flex min-h-full flex-col justify-between truncate'>
                <p className='font-semibold'>{item.name}</p>
                <span className='font-medium text-haretaColor'>${item.price}</span>

                <div className='flex space-x-1'>
                  <p className=''>{item.quantity <= 10 && t('sidebar.only')} </p>
                  <p>
                    {item.quantity} {t('sidebar.available')}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={closeAddToCart} className='px-2'>
              <FontAwesomeIcon icon={faXmark} className='h-5 opacity-70' />
            </button>
          </div>
          <div className='relative mt-4 flex items-center justify-between rounded-lg bg-lightColor900 px-3 py-2 shadow-sm dark:bg-darkColor900'>
            {isLoading && <div className='absolute left-0 top-0 h-full w-full cursor-not-allowed bg-black/40'></div>}
            <p className=''>{t('sidebar.quantity')}</p>
            <QuantityController
              classNameWrapper=''
              value={quantity}
              max={item.quantity}
              onDecrease={handleQuantity}
              onIncrease={handleQuantity}
              onType={handleQuantity}
            />
          </div>
          <div className='mt-4 w-full rounded-lg border border-black/40 p-4 dark:border-white/40'>
            <div className='max-h-40 w-full overflow-auto py-2'>
              <div className='grid w-full grid-cols-3 gap-4'>
                {productsInGroup.map((item, index) => {
                  const isActive = item.id === activeProductID
                  const avatarURL = item.avatar ? item.avatar.url : null
                  return (
                    <div
                      key={index}
                      className={classNames('col-span-1 rounded-xl', {
                        'border border-haretaColor dark:border-haretaColor': isActive
                      })}
                    >
                      <button className='relative w-full pt-[75%]' onClick={handleChooseVariant(item)}>
                        <img
                          src={avatarURL || ''}
                          alt={`${item.name} ${item.color}`}
                          className='absolute left-0 top-0 h-full w-full object-scale-down'
                        />
                        {/* {isActive && <div className='absolute inset-0 border-2 border-haretaColor' />} */}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='mt-2 flex grow items-end'>
            <Button
              className='relative bottom-0 w-full py-2'
              onClick={
                action == 'add'
                  ? isAuthenticated
                    ? addToCart
                    : temporaryPurchases.length === 0
                    ? () => {
                        setCreateTempCart(true)
                      }
                    : () => {
                        addToTemporaryCart()
                      }
                  : handleOrder
              }
            >
              {action == 'add' ? t('message.Add to cart') : t('detail.Order')}
            </Button>
          </div>
          {createTempCart && <div className='absolute inset-0 bg-black/50' ref={elementRef}></div>}

          {createTempCart && (
            <div ref={elementRef}>
              <div
                className={classNames(
                  'fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border p-8 align-middle ',
                  {
                    'border-white/60 bg-darkColor900 text-lightText': theme == 'dark',
                    'border-black/60 bg-lightColor900 text-darkText': theme == 'light'
                  }
                )}
                ref={createDialogRef}
              >
                <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>
                  {t('message.Cart expires soon')}
                </p>
                <div className='mt-4 space-y-2 text-center'>
                  <div className='inline justify-center space-x-1 '>
                    <span>{t('message.Items added without')}</span>
                    <span className='text-haretaColor'>{t('message.login')}</span>
                    <span>{t('message.are temporary')}</span>
                  </div>
                  <div className='justify-center space-x-1'>
                    <span className='capitalize text-haretaColor'>{t('message.login')}</span>
                    <span>{t('message.to')}</span>
                    <span className='text-haretaColor'>{t('message.save')}</span>
                    <span>{t('message.your items')}</span>
                  </div>
                </div>
                <div className='mt-8 flex justify-around'>
                  <Link
                    to={mainPath.login}
                    type='button'
                    className='justify-center rounded-md border border-transparent bg-haretaColor px-4 py-1 text-sm font-medium capitalize text-darkText desktop:px-6 desktop:py-2'
                  >
                    {t('message.login')}
                  </Link>
                  <button
                    type='button'
                    className='justify-center rounded-md border border-transparent bg-haretaColor px-4 py-1 text-sm font-medium capitalize text-darkText desktop:px-6 desktop:py-2'
                    onClick={createTemporaryCart}
                  >
                    {t('message.Continue')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </FloatingOverlay>
    </FloatingPortal>
  )
}
