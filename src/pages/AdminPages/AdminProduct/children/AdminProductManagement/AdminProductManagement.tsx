import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import LoadingSection from 'src/components/LoadingSection'
import { adminPath } from 'src/constants/path'
import { ProductGroup, ProductType, ProductListConfig } from 'src/types/product.type'
import { generateNameId } from 'src/utils/utils'

interface ItemProps {
  product: ProductType
  handleEnterProduct: (item: ProductType) => () => void
}

function ProductItem({ product, handleEnterProduct }: ItemProps) {
  const avatarUrl = product.avatar ? product.avatar.url : null
  return (
    <button
      className='w-full space-y-2 border border-white/20 p-2 hover:text-haretaColor'
      onClick={handleEnterProduct(product)}
    >
      <div className='relative w-full overflow-hidden pt-[75%]'>
        {avatarUrl ? (
          <img src={avatarUrl} alt={product.name} className='absolute left-0 top-0 h-full w-full object-cover' />
        ) : (
          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
            <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
          </div>
        )}
      </div>
      <p className='text-center font-medium desktop:text-lg'>{product.name}</p>
    </button>
  )
}

export default function AdminProductManagement() {
  //! Get default product list
  const queryConfig = {}
  const { data: defaultProductListData } = useQuery({
    queryKey: ['products', 'default'],
    queryFn: () => {
      return productApi.getProductList(queryConfig as ProductListConfig)
    },
    staleTime: 3 * 60 * 1000
  })
  const defaultProductList = defaultProductListData?.data.data

  //! Handle choose product
  const navigate = useNavigate()
  const handleEnterProduct = (product: ProductGroup) => () => {
    navigate({ pathname: `${adminPath.products}/${generateNameId({ name: product.name, id: product.id })}` })
  }

  return (
    <div>
      {!defaultProductList && <LoadingSection />}
      {defaultProductList && (
        <div className='grid grid-cols-2 gap-2 p-3 tablet:grid-cols-3 tablet:gap-3 desktop:grid-cols-4 desktop:gap-4'>
          {defaultProductList.map((product) => (
            <div key={product.id} className='col-span-1'>
              <ProductItem product={product} handleEnterProduct={handleEnterProduct} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
