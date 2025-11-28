import { useContext } from 'react'
import { AdminContext } from 'src/contexts/admin.context'
import { adminProductGroupApi } from 'src/apis/admin.api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { ProductType, ProductGroup, ProductListConfig } from 'src/types/product.type'
import productApi from 'src/apis/product.api'

interface Props {
  largeScreen?: boolean
}

export default function AdminSelectProductGroup({ largeScreen = false }: Props) {
  const { setProductGroup, productGroup, setCurrentProduct } = useContext(AdminContext)

  //! Get product groups
  const { data: productGroupsData } = useQuery({
    queryKey: ['product-groups'],
    queryFn: () => adminProductGroupApi.getProductGroups(),
    staleTime: 1000 * 60 * 3
  })
  const groupList = productGroupsData?.data.data || []

  //! GET DEFAULT PRODUCTS
  const queryConfig = {}
  const { data: defaultProductsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProductList(queryConfig as ProductListConfig),
    staleTime: 1000 * 60 * 3
  })
  const defaultProducts = defaultProductsData?.data.data || []
  const notEmptyProductGroups = defaultProducts.map((product) => product.group.id)

  const emptyProductGroups = groupList.filter((group) => !notEmptyProductGroups.includes(group.id))

  //! SELECT GROUP
  const queryClient = useQueryClient()
  const handleChooseGroup = (product: ProductType) => () => {
    setCurrentProduct(product)
    setProductGroup(product.group)
    queryClient.invalidateQueries({ queryKey: ['product-groups'] })
  }

  const handleChooseEmptyGroup = (group: ProductGroup) => () => {
    setCurrentProduct(null)
    setProductGroup(group)
    queryClient.invalidateQueries({ queryKey: ['product-groups'] })
  }

  //! Grid column

  return (
    <div className='relative rounded-lg border border-white/40 bg-black p-4 desktop:py-4'>
      <div className='flex flex-col items-center justify-center'>
        <p className='mb-2 text-lg font-semibold uppercase desktop:text-xl'>Chọn nhóm sản phẩm</p>
        <div className='mt-2 h-96 w-full overflow-auto rounded-lg border border-white/40 bg-darkBg '>
          <div
            className={classNames(
              'grid w-full  items-start gap-2 p-2 desktop:gap-4',
              largeScreen ? 'grid-cols-6' : 'grid-cols-4'
            )}
          >
            {defaultProducts?.map((product) => {
              const isActive = product.group.id === productGroup?.id
              const avatarURL = product.avatar ? product.avatar.url : null
              return (
                <button
                  key={product.id}
                  onClick={handleChooseGroup(product)}
                  className={classNames(
                    'col-span-1 h-auto space-y-2 overflow-hidden rounded-xl p-1 outline outline-1 outline-offset-0',
                    {
                      'outline-2 outline-primaryColor': isActive,
                      'outline-primaryColor/40': !isActive
                    }
                  )}
                >
                  <div className='relative w-full pt-[75%]'>
                    <img
                      src={avatarURL || ''}
                      alt={`${product.name} ${product.color}`}
                      className='absolute left-0 top-0 h-full w-full object-scale-down'
                    />
                  </div>
                  <div className='truncate'>{product.name}</div>
                </button>
              )
            })}

            {emptyProductGroups?.map((group) => {
              const isActive = group.id === productGroup?.id
              return (
                <button
                  key={group.id}
                  className={classNames('border-1 border-offset-0 col-span-1 h-min space-y-2 rounded-xl border p-1', {
                    'border-2 border-haretaColor': isActive,
                    'border-haretaColor/40 ': !isActive
                  })}
                  onClick={handleChooseEmptyGroup(group)}
                >
                  <div className='relative w-full pt-[75%]'>
                    <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center font-medium uppercase text-alertRed'>
                      0 sản phẩm
                    </div>
                  </div>
                  <div className='truncate'>{group.name}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
