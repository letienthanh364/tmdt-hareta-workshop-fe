import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import ProductTag from 'src/components/ProductTag'
import { ProductType } from 'src/types/product.type'
import { formatCurrency } from 'src/utils/utils'
import { Attribute } from '../../children/UserWishList/UserWishList'
import classNames from 'classnames'

interface Props {
  product: ProductType
  handleClickItem: (product: ProductType) => () => void
  handleChooseFilter: (field: string, value: string) => () => void
  addToCart: (id: string) => () => void
  openUnlikeItemDialog: (id: string) => () => void
}

export default function UserWishlistCardDesktop({
  product,
  handleClickItem,
  handleChooseFilter,
  addToCart,
  openUnlikeItemDialog
}: Props) {
  //! translation
  const { t } = useTranslation(['user'])
  const tag = product.tag

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
    <div className='grid grid-cols-12 items-center py-6 text-center text-darkText dark:text-lightText '>
      <div className='col-span-4'>
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
      <div className='col-span-5 ml-4 flex h-[80%] flex-col justify-between'>
        <div className=''>
          <button
            className='flex items-center justify-start truncate py-1.5 text-lg font-medium hover:text-haretaColor desktop:py-2 desktop:text-xl desktopLarge:text-2xl'
            onClick={handleClickItem(product)}
          >
            {product.name}
          </button>
          {tag !== 0 && <ProductTag tag={tag} />}
        </div>
        <div className='flex w-full items-center space-x-2 desktop:space-x-4'>
          {attributes.map((attribute, index) => (
            <button
              key={index}
              className='flex items-center justify-start rounded-lg border border-black/40 px-1 py-1 text-xs capitalize hover:bg-lightColor700 dark:border-white/40 dark:hover:bg-darkColor700 tablet:px-2 tablet:text-sm desktop:px-3 desktop:text-base'
              onClick={attribute.onClick}
            >
              <span className='truncate'>{attribute.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className='relative col-span-3  h-[75%] '>
        <div className='relative grid w-full grid-cols-2 items-center rounded-md border border-black/40 py-1 dark:border-white/40 desktop:py-2 '>
          <div className='col-span-1 flex items-center justify-center space-x-1 text-xs font-semibold text-darkText dark:text-lightText desktop:space-x-2 desktop:text-base'>
            <span
              className={classNames('', {
                'line-through opacity-60': isDiscounted
              })}
            >
              ${formatCurrency(product.original_price)}
            </span>
            {isDiscounted && <span className=''>${formatCurrency(product.price)}</span>}
          </div>
          <div className='absolute left-1/2 h-full border-l border-black/40 dark:border-white/40'></div>
          <button
            className='col-span-1 flex items-center justify-center bg-none text-haretaColor hover:text-primaryColor'
            onClick={addToCart(product.id)}
          >
            <FontAwesomeIcon icon={faCartPlus} className='h-auto w-4 desktop:w-6' onClick={addToCart(product.id)} />
          </button>
        </div>
        <button
          className='absolute bottom-0 right-0 bg-none hover:text-darkText dark:hover:text-lightText'
          onClick={openUnlikeItemDialog(product.group.id)}
        >
          <p className='text-xs text-alertRed/80 hover:text-alertRed hover:underline desktop:text-sm'>
            {t('wishlist.remove')}
          </p>
        </button>
      </div>
    </div>
  )
}
