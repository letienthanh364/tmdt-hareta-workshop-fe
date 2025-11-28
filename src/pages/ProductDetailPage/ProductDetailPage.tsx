import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import { ProductImage } from 'src/types/productImage.type'
import { getIdFromNameId, truncateString } from 'src/utils/utils'
import purchaseApi from 'src/apis/cart.api'
import { useViewport } from 'src/hooks/useViewport'
import classNames from 'classnames'
import { AppContext } from 'src/contexts/app.context'
import { ProductsInGroupConfig } from 'src/types/product.type'
import { AxiosError } from 'axios'
import { ErrorRespone } from 'src/types/utils.type'
import { errorResponeList } from 'src/constants/error'
import { StoreContext } from 'src/contexts/store.context'
import { useTranslation } from 'react-i18next'
import PathBar, { PathElement } from 'src/components/PathBar/PathBar'
import mainPath from 'src/constants/path'
import ProductListForCollection from './components/ProductListForCollection'
import ProductListForType from './components/ProductListForType'
import ProductDetailSkeleton from './children/ProductDetailSkeleton/ProductDetailSkeleton'
import ProductDetailDesktop from './children/ProductDetailDesktop'
import ProductDetailMobile from './children/ProductDetailMobile'
import ProductDetailLoading from './children/ProductDetailLoading'
import userLikeProductApi from 'src/apis/userLikeProduct.api'
import CustomReachDialog from 'src/components/CustomReachDialog'
import LoadingSection from 'src/components/LoadingSection'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

export interface ProductImageWithIndex extends ProductImage {
  index: number
}

export default function ProductDetailPage() {
  const { isAuthenticated, theme } = useContext(AppContext)
  const { setWishlistIDs, wishlistIDs } = useContext(StoreContext)

  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  const [dialog, setDialog] = useState(false)
  const [excuting, setExcuting] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [addError, setAddError] = useState(false)
  const [invalidQuantity, setInvalidQuantity] = useState(false)

  const [likeProductDialog, setLikeProductDialog] = useState<boolean>(false)
  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const { nameId } = useParams()

  //! Get product detail
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailData, isFetching } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const defaultProduct = productDetailData?.data.data

  //! Get product list in group
  const productsInGroupQuery: ProductsInGroupConfig = {
    id: defaultProduct?.group.id as string,
    page: '1',
    limit: '50'
  }
  const { data: productsInGroupData } = useQuery({
    queryKey: ['product-groups', 'variants', defaultProduct?.group.id],
    queryFn: () => productApi.getProductsInGroup(productsInGroupQuery),

    enabled: Boolean(defaultProduct)
  })
  const productsInGroup = productsInGroupData?.data.data || []

  //! GET WISHLIST
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => {
      return userLikeProductApi.getWishList()
    },
    staleTime: 3 * 60 * 1000,
    enabled: isAuthenticated
  })

  useEffect(() => {
    const wishlist = wishlistData?.data.data
    if (wishlist) {
      setWishlistIDs(wishlist.map((product) => product.id))
    }
  }, [setWishlistIDs, wishlistData])

  useEffect(() => {
    setIsLikedByUser(wishlistIDs.includes(id))
  }, [wishlistIDs, id])

  //! HANDLE ADD TO CART
  const addToCartMutation = useMutation({ mutationFn: purchaseApi.addToCart })
  const addToCart = (productID: string, quantity: number) => {
    setAddSuccess(false)
    setAddError(false)
    setDialog(true)
    setExcuting(true)
    addToCartMutation.mutate(
      { item_id: productID, quantity: quantity },
      {
        onSettled: () => {
          setExcuting(false)
        },
        onSuccess: () => {
          setAddSuccess(true)
          setAddError(false)
          queryClient.invalidateQueries({ queryKey: ['purchases'] })
        },
        onError: (axiosError) => {
          const errorRespone = axiosError as AxiosError
          const errorKey = (errorRespone.response?.data as ErrorRespone).error_key
          const quantityError = errorResponeList.find((error) => error.error_key === errorKey)
          setAddSuccess(false)
          setAddError(true)
          if (quantityError) {
            setInvalidQuantity(true)
          }
          return Promise.reject(axiosError)
        }
      }
    )
  }

  //! LIKE product
  const likeproductMutation = useMutation({ mutationFn: userLikeProductApi.likeProduct })
  const likeproduct = () => {
    setIsLikedByUser(true)
    likeproductMutation.mutate(
      { group_id: defaultProduct?.group.id as string },
      {
        onSuccess: () => {
          const newWishlistIDs = [...wishlistIDs, id]
          setWishlistIDs(newWishlistIDs)
          setLikeProductDialog(true)
          setTimeout(() => {
            setLikeProductDialog(false)
          }, 3000)
        }
      }
    )
  }

  const unlikeProductMutation = useMutation({ mutationFn: userLikeProductApi.unlikeProduct })
  const unlikeProduct = () => {
    setIsLikedByUser(false)
    unlikeProductMutation.mutate(
      { group_id: defaultProduct?.group.id as string },
      {
        onSuccess: () => {
          const IDindex = wishlistIDs.indexOf(id)
          const tempArray = wishlistIDs
          if (IDindex > -1) {
            tempArray.splice(IDindex, 1)
            setWishlistIDs(tempArray)
          }
        }
      }
    )
  }

  const toggleLikeProduct = () => {
    isLikedByUser && unlikeProduct()
    !isLikedByUser && likeproduct()
  }

  //! translation
  const { t } = useTranslation('productdetail')

  if (!defaultProduct) return <ProductDetailLoading />

  //! PATH BAR
  const pathList: PathElement[] = [
    {
      pathName: t('path.store'),
      url: mainPath.store,
      isNotALink: false
    },
    {
      pathName: defaultProduct.name,
      url: '',
      isNotALink: true
    }
  ]
  return (
    <div className='bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'>
      <Helmet>
        <title>{defaultProduct.name} | Hareta Workshop</title>
        <meta
          name='description'
          content={convert(truncateString(defaultProduct.description, 150), {
            limits: { maxInputLength: 160 }
          })}
        />
      </Helmet>

      <div className='container'>
        <PathBar pathList={pathList} />

        {!isMobile && (
          <Fragment>
            {isFetching && <ProductDetailSkeleton />}
            {!isFetching && (
              <ProductDetailDesktop
                defaultProduct={defaultProduct}
                isLikedByUser={isLikedByUser}
                productsInGroup={productsInGroup}
                addToCart={addToCart}
                toggleLikeProduct={toggleLikeProduct}
              />
            )}
            <div className='my-20 space-y-20'>
              <ProductListForCollection collectionName={defaultProduct.collection} />
              <ProductListForType type={defaultProduct.type} />
            </div>
          </Fragment>
        )}
        {isMobile && (
          <Fragment>
            {isFetching && <ProductDetailSkeleton />}
            {!isFetching && (
              <ProductDetailMobile
                productsInGroup={productsInGroup}
                defaultProduct={defaultProduct}
                isLikedByUser={isLikedByUser}
                addToCart={addToCart}
                toggleLikeProduct={toggleLikeProduct}
              />
            )}
          </Fragment>
        )}
      </div>

      <CustomReachDialog
        isOpen={dialog}
        handleClose={() => setDialog(false)}
        closeButton
        classNameWrapper='relative w-72 max-w-md transform overflow-hidden rounded-2xl p-6 align-middle shadow-xl transition-all'
      >
        {excuting && <LoadingSection className='flex h-40 w-full items-center justify-center' />}
        {addSuccess && (
          <Fragment>
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
          </Fragment>
        )}
        {addError && (
          <Fragment>
            {invalidQuantity && (
              <Fragment>
                <div className='text-center'>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={classNames('h-auto w-8 text-alertRed tablet:w-10 desktop:w-12 desktopLarge:w-16')}
                  />
                </div>
                <p className='mt-6 text-center text-xl font-medium leading-6'>
                  {t('message.The quantity of the current item you are trying to add exceed our store')}
                </p>
              </Fragment>
            )}
            {!invalidQuantity && (
              <Fragment>
                <div className='text-center'>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={classNames('h-auto w-8 text-alertRed tablet:w-10 desktop:w-12 desktopLarge:w-16')}
                  />
                </div>
                <p className='mt-6 text-center text-xl font-medium leading-6'>
                  {t('message.Something went wrong, please try again')}
                </p>
              </Fragment>
            )}
          </Fragment>
        )}
      </CustomReachDialog>

      <CustomReachDialog
        isOpen={likeProductDialog}
        handleClose={() => setLikeProductDialog(false)}
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
        <p className='mt-6 text-center text-xl font-medium leading-6'>{t('message.Product was added to wish list')}</p>
      </CustomReachDialog>
    </div>
  )
}
