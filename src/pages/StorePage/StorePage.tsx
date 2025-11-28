import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { useViewport } from 'src/hooks/useViewport'
import { ProductListConfig } from 'src/types/product.type'
import userLikeProductApi from 'src/apis/userLikeProduct.api'
import { useContext, useEffect } from 'react'
import { AppContext } from 'src/contexts/app.context'
import PathBar from 'src/components/PathBar'
import { StoreContext } from 'src/contexts/store.context'
import { useTranslation } from 'react-i18next'
import { PathElement } from 'src/components/PathBar/PathBar'
import mainPath from 'src/constants/path'
import StorePageMobile from './children/StorePageMobile'
import StorePageDesktop from './children/StorePageDesktop'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'
import StoreMobileBottomBar from './components/StoreMobileBottomBar'
import { Helmet } from 'react-helmet-async'

export default function StorePage() {
  const { isAuthenticated } = useContext(AppContext)
  const { setWishlistIDs } = useContext(StoreContext)

  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768

  const queryConfig = useProductListQueryConfig()

  //! GET PRODUCT LIST
  const { data: storeData, isFetching } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProductList(queryConfig as ProductListConfig)
    },

    staleTime: 3 * 60 * 1000
  })

  //! GET WISHLIST
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => {
      return userLikeProductApi.getWishList()
    },
    enabled: isAuthenticated
  })

  useEffect(() => {
    const wishlist = wishlistData?.data.data
    if (wishlist) {
      setWishlistIDs(wishlist.map((product) => product.id))
    }
  }, [setWishlistIDs, wishlistData])

  //! Multi languages
  const { t } = useTranslation('store')

  //! PATH LIST
  const pathList: PathElement[] = [
    {
      pathName: t('path bar.store'),
      url: mainPath.store,
      isNotALink: false
    }
  ]

  return (
    <div className='bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'>
      <Helmet>
        <title>{t('helmet.Store')} | Hareta Workshop</title>
        <meta
          name='description'
          content={t(
            "helmet.Discover our store for unique, handcrafted keycaps. Each piece is a work of art, blending quality and creativity to enhance your keyboard's personality and style."
          )}
        />
      </Helmet>
      <div className='container space-y-6'>
        <PathBar pathList={pathList} />

        {!isMobile && <StorePageDesktop storeData={storeData} isFetching={isFetching} isLoading={isLoading} />}

        {isMobile && <StorePageMobile storeData={storeData} isFetching={isFetching} isLoading={isLoading} />}
      </div>
      {isMobile && <StoreMobileBottomBar queryConfig={queryConfig} />}
    </div>
  )
}
