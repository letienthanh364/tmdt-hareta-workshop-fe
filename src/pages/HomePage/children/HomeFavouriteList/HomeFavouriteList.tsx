import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import userLikeProductApi from 'src/apis/userLikeProduct.api'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { StoreContext } from 'src/contexts/store.context'
import { ProductListQueryConfig } from 'src/hooks/useProductListQueryConfig'
import { useViewport } from 'src/hooks/useViewport'
import ProductCard from 'src/components/ProductCard'
import ProductSekeleton from 'src/components/ProductSkeleton'

const DESKTOP_LIMIT = 8
const MOBILE_LIMIT = 4

export default function HomeFavouriteList() {
  const { isAuthenticated } = useContext(AppContext)
  const { setWishlistIDs } = useContext(StoreContext)

  const viewPort = useViewport()
  const isMobile = viewPort.width < 1024

  //? GET WISHLIST
  const { data: wishlistData, isLoading: productListIsLoading } = useQuery({
    queryKey: ['user_wish_list'],
    queryFn: () => {
      return userLikeProductApi.getWishList()
    },
    enabled: isAuthenticated
  })

  useEffect(() => {
    const wishlist = wishlistData?.data.data
    if (wishlist) {
      setWishlistIDs(wishlist.map((item) => item.id))
    }
  }, [setWishlistIDs, wishlistData])

  //! Get favourite product list
  const itemsConfig: ProductListQueryConfig = { limit: String(DESKTOP_LIMIT) }
  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['favourtie_items', itemsConfig],
    queryFn: () => {
      return productApi.getProductList(itemsConfig)
    }
  })
  const itemList = itemsData?.data.data || []
  const firstRow = isMobile ? itemList.slice(0, MOBILE_LIMIT / 2) : itemList.slice(0, DESKTOP_LIMIT / 2)
  const secondRow = isMobile
    ? itemList.slice(MOBILE_LIMIT / 2, MOBILE_LIMIT)
    : itemList.slice(DESKTOP_LIMIT / 2, DESKTOP_LIMIT)

  //! HANDLE NAVIGATE
  const navigate = useNavigate()
  const handleNavigate = () => {
    navigate({
      pathname: mainPath.store,
      search: createSearchParams({
        tag: '3'
      }).toString()
    })
  }

  //! Multi languages
  const { t } = useTranslation('home')

  return (
    <div className='relative rounded-xl border border-black/60 py-4 duration-200 dark:border-white/60 tablet:py-6 desktop:py-8 desktopLarge:py-10'>
      <div className='absolute left-2 top-0 -translate-y-1/2 bg-lightBg duration-200 dark:bg-darkBg tablet:left-4 desktopLarge:left-8'>
        <p className='px-1 py-2 text-left text-2xl font-bold uppercase text-tagColor desktop:text-4xl desktopLarge:text-5xl'>
          {t('most favourite')}
        </p>
      </div>

      <div className='absolute right-2 top-0 -translate-y-1/2 bg-lightBg duration-200 dark:bg-darkBg tablet:right-4 desktopLarge:right-8'>
        <button
          className='flex items-center gap-2 rounded-md border border-black/60 px-2 py-1 text-xs hover:border-transparent hover:bg-primaryColor hover:font-medium hover:text-darkText dark:border-white/60 dark:hover:border-transparent tablet:gap-3 tablet:text-base desktopLarge:text-lg'
          onClick={handleNavigate}
        >
          {!isMobile && <p className='truncate uppercase'>{t('explore')}</p>}
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

      <div className='space-y-4 px-2 desktop:space-y-6 desktop:px-8 desktopLarge:px-12'>
        <div className='grid grid-cols-5 gap-4 desktop:grid-cols-9 desktop:gap-8'>
          {isLoading &&
            Array(DESKTOP_LIMIT / 2)
              .fill(0)
              .map((_, index) => (
                <div className='col-span-2' key={index}>
                  <ProductSekeleton />
                </div>
              ))}
          {!isLoading &&
            firstRow.map((item) => (
              <div className='col-span-2' key={item.id}>
                <ProductCard product={item} initialLoading={productListIsLoading} />
              </div>
            ))}
        </div>

        <div className='grid grid-cols-5 gap-4 desktop:grid-cols-9 desktop:gap-8'>
          <div className='col-span-1'></div>
          {isLoading &&
            Array(DESKTOP_LIMIT / 2)
              .fill(0)
              .map((_, index) => (
                <div className='col-span-2' key={index}>
                  <ProductSekeleton />
                </div>
              ))}
          {!isLoading &&
            secondRow.map((item) => (
              <div className='col-span-2' key={item.id}>
                <ProductCard product={item} initialLoading={productListIsLoading} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
