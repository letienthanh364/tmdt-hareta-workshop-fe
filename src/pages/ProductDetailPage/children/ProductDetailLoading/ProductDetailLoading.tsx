import ProductDetailSkeleton from '../ProductDetailSkeleton/ProductDetailSkeleton'

export default function ProductDetailLoading() {
  return (
    <div className='bg-lightBg py-2 dark:bg-darkBg desktopLarge:py-6'>
      <div className='container'>
        <ProductDetailSkeleton />
      </div>
    </div>
  )
}
