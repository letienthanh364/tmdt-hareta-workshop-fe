import { faCartPlus, faCheck, faHeart, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, useContext, useState } from 'react'
import { ProductType } from 'src/types/product.type'
import { formatCurrency } from 'src/utils/utils'
import classNames from 'classnames'
import useClickOutside from 'src/hooks/useClickOutside'
import { AppContext } from 'src/contexts/app.context'
import ProductMobileImageList from '../../components/ProductMobileImageList/ProductMobileImageList'
import DialogPopup from 'src/components/DialogPopup'
import ProductListForCollection from '../../components/ProductListForCollection'
import ProductListForType from '../../components/ProductListForType'
import { useTranslation } from 'react-i18next'
import ProductMobileActionDialog from '../../components/ProductMobileActionDialog'
import ProductDetailVariantList from '../../components/ProductDetailVariantList'
import ProductDetailDescription from '../../components/ProductDetailDescription/ProductDetailDescription'
import ProductTag from 'src/components/ProductTag'
import LoadingSection from 'src/components/LoadingSection'

interface Props {
  defaultProduct: ProductType
  productsInGroup: ProductType[]
  isLikedByUser: boolean
  addToCart: (itemID: string, quantity: number) => void
  toggleLikeProduct: () => void
}

export default function ProductDetailMobile(props: Props) {
  const { defaultProduct, isLikedByUser, productsInGroup, addToCart, toggleLikeProduct } = props

  const { isAuthenticated, theme } = useContext(AppContext)

  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false)
  const [errorDialog, setErrorDialog] = useState<boolean>(false)
  const [activeProduct, setActiveProduct] = useState<ProductType>(defaultProduct)
  const [action, setAction] = useState<string>('add')
  const [orderingDialog, setOrderingDialog] = useState(false)

  //! CHOOSE VARIANT
  const handleChooseVariant = (product: ProductType) => () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setActiveProduct(product)
  }

  //! Open dialog
  const { ref, visible, setVisible } = useClickOutside(false)
  const openAddToCart = () => {
    setVisible(true)
    setAction('add')
  }

  const openBuy = () => {
    setVisible(true)
    setAction('buy')
  }

  const tag = defaultProduct.tag
  //! Multi languages
  const { t } = useTranslation('productdetail')

  const isSaleOff = defaultProduct.price < defaultProduct.original_price

  return (
    <Fragment>
      <div className='bg-lightBg pb-10 dark:bg-darkBg'>
        <div className='overflow-hidden rounded-lg bg-lightColor700 dark:bg-darkColor700'>
          <ProductMobileImageList product={defaultProduct} productID={activeProduct.id} />
          <div className='relative flex flex-col space-y-3 bg-lightColor700 px-3 py-3 text-darkText dark:bg-darkColor700 dark:text-lightText'>
            <div className='flex space-x-2 text-2xl'>
              <span
                className={classNames('', {
                  'line-through opacity-60': isSaleOff,
                  'text-haretaColor': !isSaleOff
                })}
              >
                ${formatCurrency(defaultProduct.original_price)}
              </span>
              {isSaleOff && <span className='text-haretaColor'>${formatCurrency(defaultProduct.price)}</span>}
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-2xl'>{defaultProduct.name}</p>
              {isAuthenticated && (
                <button className=''>
                  <FontAwesomeIcon
                    icon={faHeart}
                    onClick={toggleLikeProduct}
                    className={classNames('h-6', {
                      'text-darkText/40 dark:text-lightText/40': !isLikedByUser,
                      'text-favouriteRed': isLikedByUser
                    })}
                  />
                </button>
              )}
            </div>

            {defaultProduct.tag !== 0 && <ProductTag tag={tag} />}

            <ProductDetailVariantList
              defaultProduct={defaultProduct}
              productsInGroup={productsInGroup}
              activeProductID={activeProduct.id}
              handleChooseVariant={handleChooseVariant}
            />

            <div className='mt-4 h-full text-sm desktop:text-lg'>
              <ProductDetailDescription product={defaultProduct} />
            </div>
          </div>
        </div>

        <div className='mt-8 space-y-6 rounded-lg tabletSmall:space-y-8'>
          <ProductListForCollection collectionName={defaultProduct.collection} />
          <ProductListForType type={defaultProduct.type} />
        </div>

        <div className='fixed bottom-0 left-0 z-10 grid h-10 w-full grid-cols-2 bg-white text-base text-darkText dark:bg-black dark:text-lightText tabletSmall:h-12'>
          <button
            onClick={openAddToCart}
            disabled={visible}
            className='col-span-1 flex items-center justify-center text-center'
          >
            <FontAwesomeIcon icon={faCartPlus} className='h-5' />
          </button>
          <button
            onClick={openBuy}
            disabled={visible}
            className={classNames(
              'col-span-1 rounded-sm bg-unhoveringBg font-medium text-darkText hover:bg-hoveringBg ',
              {
                'opacity-40': visible
              }
            )}
          >
            {t('sidebar.buy')}
          </button>
        </div>
      </div>
      {visible && (
        <ProductMobileActionDialog
          action={action}
          activeProduct={activeProduct}
          setActiveProduct={setActiveProduct}
          productsInGroup={productsInGroup}
          elementRef={ref}
          visible={visible}
          setVisible={setVisible}
          handleAddToCart={addToCart}
          setDialogIsOpen={setDialogIsOpen}
          setErrorDialog={setErrorDialog}
          setOrderingDialog={setOrderingDialog}
        />
      )}

      <DialogPopup
        isOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
      >
        <div className=' text-center'>
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
      </DialogPopup>

      <DialogPopup
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
      </DialogPopup>

      <DialogPopup
        isOpen={orderingDialog}
        closeButton={false}
        handleClose={() => setOrderingDialog(false)}
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
      >
        <LoadingSection className='flex h-40 w-full items-center justify-center' />
      </DialogPopup>
    </Fragment>
  )
}
