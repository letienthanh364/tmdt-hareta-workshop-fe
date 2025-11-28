import ProductSekeleton from 'src/components/ProductSkeleton'

export default function StoreProductListSkeleton() {
  return (
    <div className=''>
      <div className='grid grid-cols-2 gap-4 desktop:grid-cols-3'>
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <div key={index} className='col-span-1'>
              <ProductSekeleton />
            </div>
          ))}
      </div>
    </div>
  )
}
