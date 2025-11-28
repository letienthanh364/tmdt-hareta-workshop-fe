import { faCartPlus, faCheck, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import QuantityController from 'src/components/QuantityController'
import { formatCurrency } from 'src/utils/utils'
import { AppContext } from 'src/contexts/app.context'
import classNames from 'classnames'
import ProductDescription from '../../components/ProductDetailDescription/ProductDetailDescription'
import { CartContext } from 'src/contexts/cart.context'
import { ProductType } from 'src/types/product.type'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'

import { useTranslation } from 'react-i18next'
import ProductDetailImageList from '../../components/ProductDetailImageList'
import ProductDetailVariantList from '../../components/ProductDetailVariantList'
import ProductTag from 'src/components/ProductTag'
import CustomReachDialog from 'src/components/CustomReachDialog'
import useAddToTempCartAndQuickOrder from 'src/hooks/useAddToTempCartAndQuickOrder'
import LoadingSection from 'src/components/LoadingSection'

interface Props {
  defaultProduct: ProductType
  productsInGroup: ProductType[]
  isLikedByUser: boolean
  addToCart: (itemID: string, quantity: number) => void
  toggleLikeProduct: () => void
}

export default function ProductDetailDesktop(props: Props) {
  const currentDateString = Date.now().toString()

  const { defaultProduct, isLikedByUser, productsInGroup, addToCart, toggleLikeProduct } = props

  const { isAuthenticated, theme } = useContext(AppContext)
  const { temporaryPurchases } = useContext(CartContext)

  const [successDialog, setSuccessDialog] = useState<boolean>(false)
  const [errorDialog, setErrorDialog] = useState<boolean>(false)
  const [orderingDialog, setOrderingDialog] = useState<boolean>(false)
  const [activeProduct, setActiveProduct] = useState<ProductType>(defaultProduct)

  const [createTempCart, setCreateTempCart] = useState<boolean>(false)

  //! Get tag
  const tag = defaultProduct.tag

  //! CHOOSE VARIANT
  const handleChooseVariant = (product: ProductType) => () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setQuantity(1)
    setActiveProduct(product)
  }

  //! ADD TO CART
  const [quantity, setQuantity] = useState<number>(1)
  const handleQuantity = (value: number) => {
    setQuantity(value)
  }

  const handleAddToCart = () => {
    addToCart(activeProduct.id, quantity)
    setQuantity(1)
  }

  //! Handle add to temporary cart and handle quick order
  const { addToTemporaryCart, createTemporaryCart, handleOrder } = useAddToTempCartAndQuickOrder({
    activeProduct,
    quantity,
    currentDateString,
    setQuantity,
    setDialogIsOpen: setSuccessDialog,
    setErrorDialog,
    setOrderingDialog,
    setCreateTempCart
  })

  //! CHECK IN STOCK
  const inStock = activeProduct.quantity > 0

  //! Multi languages
  const { t } = useTranslation('productdetail')

  const isSaleOff = defaultProduct.price < defaultProduct.original_price

  return (
    <div className='relative grid grid-cols-12 gap-4 desktop:gap-8 desktopLarge:gap-16'>
      <div className='col-span-4'>
        <div className='sticky left-0 top-14 z-10 flex-col rounded-xl bg-lightColor700 p-2 text-darkText shadow-md dark:bg-darkColor700 dark:text-lightText desktop:top-20 desktop:p-4 desktopLarge:p-6'>
          <div className='relative flex items-center justify-between'>
            <p className='line-clamp-1 text-xl font-semibold desktop:text-2xl'>{defaultProduct.name}</p>
            {isAuthenticated && (
              <button onClick={toggleLikeProduct} className=''>
                <FontAwesomeIcon
                  className={classNames('h-auto w-5 hover:text-favouriteRed desktop:w-6 desktopLarge:w-7', {
                    'text-favouriteRed': isLikedByUser,
                    'text-black/40 dark:text-white/40': !isLikedByUser
                  })}
                  icon={faHeart}
                />
              </button>
            )}
          </div>
          <div className='mt-2'>{tag !== 0 && <ProductTag tag={tag} />}</div>
          <div className='mt-2 flex space-x-2'>
            <span
              className={classNames('text-base font-medium  desktop:text-lg desktopLarge:text-xl', {
                'line-through opacity-60': isSaleOff,
                'text-haretaColor': !isSaleOff
              })}
            >
              ${formatCurrency(defaultProduct.original_price)}
            </span>
            {isSaleOff && (
              <span className='text-base font-medium text-haretaColor desktop:text-lg desktopLarge:text-xl'>
                ${formatCurrency(defaultProduct.price)}
              </span>
            )}
          </div>

          <ProductDetailVariantList
            defaultProduct={defaultProduct}
            productsInGroup={productsInGroup}
            activeProductID={activeProduct.id}
            handleChooseVariant={handleChooseVariant}
          />

          {inStock && (
            <div className='w-full'>
              <div className='mt-6 items-center justify-between text-xs desktop:flex desktop:space-x-2 desktop:text-sm'>
                <div className='flex items-center space-x-2'>
                  <p className='text-darkText dark:text-lightText'>{t('sidebar.quantity')}:</p>
                  <QuantityController
                    classNameWrapper=''
                    value={quantity}
                    max={defaultProduct.quantity}
                    onDecrease={handleQuantity}
                    onIncrease={handleQuantity}
                    onType={handleQuantity}
                  />
                </div>
                <p className='items-center space-x-1 text-xs text-darkText/60 dark:text-lightText/60 desktop:text-sm'>
                  {defaultProduct.quantity <= 10 && <span>{t('sidebar.only')}</span>}
                  <span>
                    {defaultProduct.quantity} {t('sidebar.available')}
                  </span>
                </p>
              </div>

              <div className='mt-4 flex justify-between text-darkText'>
                <button
                  className='flex items-center rounded-md bg-haretaColor px-6 py-1 text-sm hover:bg-primaryColor desktop:py-1.5 desktop:text-base desktopLarge:text-lg'
                  onClick={
                    isAuthenticated
                      ? handleAddToCart
                      : temporaryPurchases.length === 0
                      ? () => {
                          setCreateTempCart(true)
                        }
                      : () => {
                          addToTemporaryCart()
                        }
                  }
                >
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
                <button
                  onClick={handleOrder}
                  className='flex items-center space-x-2 rounded-md bg-haretaColor px-6 py-1 text-sm font-medium hover:bg-primaryColor desktop:py-1.5 desktop:text-base desktopLarge:text-lg'
                >
                  {t('sidebar.buy')}
                </button>
              </div>
            </div>
          )}
          {!inStock && (
            <div className='mt-2 flex w-full items-center justify-center text-lg font-semibold uppercase text-alertRed dark:text-alertRed desktop:mt-4 desktop:text-xl desktopLarge:mt-6 desktopLarge:text-2xl'>
              {t('sidebar.out of stock')}
            </div>
          )}
        </div>
      </div>
      <div className='col-span-8'>
        <div className='h-full w-full'>
          <ProductDetailImageList product={defaultProduct} productID={activeProduct.id} />

          <div className='mt-12'>
            <ProductDescription product={defaultProduct} />
          </div>
        </div>
      </div>

      {/*//! CREATE TEMP CART DIALOG */}
      <CustomReachDialog
        closeButton={false}
        isOpen={createTempCart}
        handleClose={() => setCreateTempCart(false)}
        classNameWrapper='relative w-md max-w-md transform overflow-hidden rounded-2xl p-8 align-middle shadow-xl transition-all  '
      >
        <p className='text-center text-xl font-semibold uppercase leading-6 text-alertRed'>
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
            className='justify-center rounded-md border border-transparent bg-haretaColor px-4 py-1 text-sm font-medium capitalize text-darkText hover:bg-primaryColor desktop:px-6 desktop:py-2'
          >
            {t('message.login')}
          </Link>
          <button
            type='button'
            className='justify-center rounded-md border border-transparent bg-haretaColor px-4 py-1 text-sm font-medium capitalize text-darkText hover:bg-primaryColor desktop:px-6 desktop:py-2'
            onClick={createTemporaryCart}
          >
            {t('message.Continue')}
          </button>
        </div>
      </CustomReachDialog>

      {/* //! SUCCESS DIALOG */}
      <CustomReachDialog
        isOpen={successDialog}
        handleClose={() => setSuccessDialog(false)}
        closeButton
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
      >
        <div className='text-center'>
          <FontAwesomeIcon
            icon={faCheck}
            fontSize={36}
            className={classNames('text- rounded-full  p-4 text-center text-successGreen ', {
              'bg-black/20': theme === 'light',
              'bg-white/20': theme === 'dark'
            })}
          />
        </div>
        <p className='mt-6 text-center text-xl font-medium leading-6'>{t('message.Product was added to cart')}</p>
      </CustomReachDialog>

      {/* //! ERROR DIALOG */}
      <CustomReachDialog
        isOpen={errorDialog}
        handleClose={() => setErrorDialog(false)}
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
      >
        <div className='text-center'>
          <FontAwesomeIcon
            icon={faXmark}
            className={classNames('h-auto w-8 text-alertRed tablet:w-10 desktop:w-12 desktopLarge:w-16')}
          />
        </div>
        <p className='mt-6 text-center text-xl font-medium leading-6'>
          {t('message.The quantity of the current item you are trying to add exceed our store')}
        </p>
      </CustomReachDialog>

      {/* Order dialog */}
      <CustomReachDialog
        isOpen={orderingDialog}
        closeButton={false}
        handleClose={() => setOrderingDialog(false)}
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
      >
        <LoadingSection className='flex h-40 w-full items-center justify-center' />
      </CustomReachDialog>
    </div>
  )
}
