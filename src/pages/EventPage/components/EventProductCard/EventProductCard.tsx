import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import ProductTag from 'src/components/ProductTag'
import mainPath from 'src/constants/path'
import { ProductType } from 'src/types/product.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function EventProductCard({ product }: Props) {
  const avatarUrl = product.avatar ? product.avatar.url : null

  //! HANDLE ENTER ITEM
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const handleClickItem = () => {
    navigate({ pathname: `${mainPath.store}/${generateNameId({ name: product.name, id: product.id })}` })
    queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  }

  return (
    <button onClick={handleClickItem} className='group flex w-full items-center justify-center duration-200'>
      <div className='relative w-full overflow-hidden rounded-xl bg-productLightBg pb-4 duration-200 dark:bg-productDarkBg'>
        <div className='relative w-full pt-[75%]'>
          <div className='absolute left-0 top-0 h-full w-full'>
            {avatarUrl ? (
              <img src={avatarUrl} alt={product.name} className='absolute left-0 top-0 h-full w-full object-cover' />
            ) : (
              <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col items-center justify-between space-x-1 space-y-1 overflow-hidden px-2 pt-2 tabletSmall:px-3 desktop:px-4 desktop:pt-4'>
          <p className='flex h-full justify-center space-x-2 overflow-hidden truncate text-center text-sm font-semibold uppercase text-darkText duration-200 group-hover:text-primaryColor dark:text-lightText dark:group-hover:text-primaryColor tabletSmall:text-base desktop:text-lg'>
            <span className=''>{product.name}</span>
            <span className='font-normal opacity-60'>({product.color})</span>
          </p>

          <div className='flex space-x-2'>
            <span className='text-xs font-semibold line-through opacity-60 tabletSmall:text-sm desktop:text-base desktopLarge:text-lg'>
              ${formatCurrency(product.original_price)}
            </span>
            <span className='text-xs font-semibold text-haretaColor tabletSmall:text-sm desktop:text-base desktopLarge:text-lg'>
              ${formatCurrency(product.price)}
            </span>
          </div>
        </div>
        {product.tag !== 0 && (
          <div className='absolute left-0 top-4'>
            <ProductTag tag={product.tag} />
          </div>
        )}
      </div>
    </button>
  )
}
