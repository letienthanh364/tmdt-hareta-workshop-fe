import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProductTag from 'src/components/ProductTag'
import { useViewport } from 'src/hooks/useViewport'
import { ProductType } from 'src/types/product.type'
import { formatCurrency } from 'src/utils/utils'
import { Attribute } from '../../children/UserWishList/UserWishList'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

interface Props {
  product: ProductType
  handleClickItem: (item: ProductType) => () => void
  handleChooseFilter: (field: string, value: string) => () => void
  addToCart: (id: string) => () => void
  openUnlikeItemDialog: (id: string) => () => void
}

export default function UserWishlistCardMobile({
  product,
  handleClickItem,
  handleChooseFilter,
  addToCart,
  openUnlikeItemDialog
}: Props) {
  const viewPort = useViewport()
  const isWide = viewPort.width >= 640

  //! translation
  const { t } = useTranslation(['user'])

  //! Attribute list
  const attributes: Attribute[] = [
    {
      name: product.category,
      onClick: handleChooseFilter('category', product.category)
    },
    {
      name: product.collection,
      onClick: handleChooseFilter('collection', product.collection)
    },
    {
      name: product.type,
      onClick: handleChooseFilter('type', product.type)
    }
  ]

  //! Check discount
  const isDiscounted = product.price < product.original_price

  return (
    <div className='py-2 tabletSmall:px-4 tabletSmall:py-4'>
      <div className='grid grid-cols-12 text-center text-darkText dark:text-lightText '>
        <div className='col-span-5'>
          <button className='relative w-full pt-[75%]' onClick={handleClickItem(product)}>
            <img
              alt={product.name}
              src={
                product.avatar
                  ? product.avatar.url
                  : 'https://static.vecteezy.com/system/resources/previews/000/582/613/original/photo-icon-vector-illustration.jpg'
              }
              className='absolute left-0 top-0 h-full w-full object-scale-down'
            />
          </button>
        </div>
        <div className='col-span-7 ml-2 tabletSmall:ml-4'>
          <div className='flex min-h-full flex-col justify-start'>
            <button
              className='flex items-center justify-start truncate py-1 text-base font-medium tabletSmall:text-lg'
              onClick={handleClickItem(product)}
            >
              {product.name}
            </button>
            <div>{product.tag !== 0 && <ProductTag tag={product.tag} />}</div>
            {isWide && (
              <div className='mt-4 flex w-full items-center justify-between space-x-2 font-medium'>
                {attributes.map((attribute, index) => (
                  <button
                    key={index}
                    className='flex w-1/3 items-center justify-center overflow-hidden truncate rounded-lg border border-black/40 px-1 py-1 text-sm capitalize hover:bg-lightColor700 dark:border-white/40 dark:hover:bg-darkColor700 tablet:px-2 tablet:text-sm'
                    onClick={attribute.onClick}
                  >
                    <div className='w-full overflow-hidden'>{attribute.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isWide && (
        <div className='mt-2 flex items-center justify-between space-x-2'>
          {attributes.map((attribute, index) => (
            <button
              key={index}
              className='flex w-1/3 items-center justify-center overflow-hidden rounded-lg border border-black/40 px-1 py-1 text-xs font-medium capitalize hover:bg-lightColor700 dark:border-white/40 dark:hover:bg-darkColor700 mobileLarge:px-2'
              onClick={attribute.onClick}
            >
              <div className='w-full overflow-hidden'>{attribute.name}</div>
            </button>
          ))}
        </div>
      )}

      <div className='relative mt-3 flex items-center space-x-8 tabletSmall:space-x-12 '>
        <div className='relative grid w-full grid-cols-2 items-center rounded-md border border-black/30 py-1.5 dark:border-white/30  tabletSmall:py-2'>
          <div className='col-span-1 flex items-center justify-center space-x-1 text-xs font-semibold text-darkText dark:text-lightText mobileLarge:space-x-2 mobileLarge:text-base desktop:text-base'>
            <span
              className={classNames('', {
                'line-through opacity-60': isDiscounted
              })}
            >
              ${formatCurrency(product.original_price)}
            </span>
            {isDiscounted && <span className=''>${formatCurrency(product.price)}</span>}
          </div>

          <div className='absolute left-1/2 h-full border-l border-black/30 dark:border-white/30' />
          <button
            className='col-span-1 flex items-center justify-center bg-none text-haretaColor hover:text-primaryColor'
            onClick={addToCart(product.id)}
          >
            <FontAwesomeIcon icon={faCartPlus} className='h-4 w-auto tabletSmall:h-5' onClick={addToCart(product.id)} />
          </button>
        </div>
        <button
          className='bg-none hover:text-darkText dark:hover:text-lightText'
          onClick={openUnlikeItemDialog(product.group.id)}
        >
          <p className='text-xs text-alertRed/80 hover:text-alertRed hover:underline tabletSmall:text-sm desktop:text-sm'>
            {t('wishlist.remove')}
          </p>
        </button>
      </div>
    </div>
  )
}
