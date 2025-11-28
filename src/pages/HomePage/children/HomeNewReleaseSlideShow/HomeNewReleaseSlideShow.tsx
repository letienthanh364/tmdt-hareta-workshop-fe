import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { useTranslation } from 'react-i18next'
import { ProductListQueryConfig } from 'src/hooks/useProductListQueryConfig'
import HomeNewReleaseProductCard from '../../components/HomeNewReleaseProductCard'
import LoadingRing from 'src/components/LoadingRing'

export default function HomeNewReleaseSlideShow() {
  //! GET ITEMS
  const itemsConfig: ProductListQueryConfig = {}
  const { data: productListData } = useQuery({
    queryKey: ['products', itemsConfig],
    queryFn: () => {
      return productApi.getProductList(itemsConfig)
    }
  })
  const productList = productListData?.data.data || []
  let newReleaseProduct = null
  if (productList.length > 0) {
    newReleaseProduct = productList[0]
  }

  //! Multi languages
  const { t } = useTranslation('home')

  return (
    <div className='text-darkText duration-200 dark:text-lightText'>
      <div className='w-full text-center'>
        <p className='text-2xl font-bold uppercase text-haretaColor desktop:text-4xl desktopLarge:text-5xl'>
          {t('new release')}
        </p>
      </div>
      {!newReleaseProduct && (
        <div className='flex h-40 items-center justify-center tablet:h-60 desktop:h-80'>
          <LoadingRing />
        </div>
      )}
      {newReleaseProduct && (
        <div className='relative mt-4 desktop:mt-6 desktopLarge:mt-8'>
          <HomeNewReleaseProductCard product={newReleaseProduct} />
        </div>
      )}
    </div>
  )
}
