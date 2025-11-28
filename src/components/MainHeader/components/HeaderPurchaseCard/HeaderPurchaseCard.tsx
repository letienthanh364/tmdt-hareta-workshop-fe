import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { Purchase } from 'src/types/cart.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

interface Props {
  purchase: Purchase
  isTemporary?: boolean
  handleRemove: () => void
  isDisabled?: boolean
}

export default function HeaderPurchaseCard({ purchase, handleRemove, isDisabled = false }: Props) {
  //! Multi languages
  const { t } = useTranslation('header')

  //! Check discount
  const isDiscounted = purchase.item.price < purchase.item.original_price

  return (
    <div
      className='flex items-center border-t border-black/40 p-3 first:border-none hover:bg-lightColor700/60 dark:border-white/40 dark:hover:bg-darkColor700/60'
      key={purchase.id}
    >
      <div className='h-14 w-14 shrink-0'>
        <div className='relative w-full pt-[100%]'>
          {purchase.item.avatar ? (
            <img
              src={purchase.item.avatar.url}
              alt={purchase.item.name}
              className='pointer-events-none absolute left-0 top-0 h-full w-full object-cover'
            />
          ) : (
            <div className='pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center object-cover text-lg'>
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
          )}
        </div>
      </div>

      <div className='flex w-full flex-col justify-between space-y-2 overflow-hidden pl-2 text-sm desktop:text-base'>
        <div className='flex items-center justify-between'>
          <NavLink
            to={`${mainPath.store}/${generateNameId({ name: purchase.item.name, id: purchase.item.id })}`}
            className='flex overflow-hidden'
          >
            <p className='truncate pr-2 font-semibold capitalize hover:text-primaryColor dark:hover:text-primaryColor'>
              {purchase.item.name}
            </p>
          </NavLink>
          <div className='flex space-x-2 font-medium'>
            <span
              className={classNames('flex-shrink-0', {
                ' text-haretaColor': !isDiscounted,
                'line-through opacity-60': isDiscounted
              })}
            >
              ${formatCurrency(purchase.item.original_price)}
            </span>
            {isDiscounted && (
              <span className='flex-shrink-0 text-haretaColor'>${formatCurrency(purchase.item.price)}</span>
            )}
          </div>
        </div>
        <div className='flex justify-between'>
          <span className='text-xs capitalize text-darkText/60 dark:text-lightText/60 desktop:text-sm'>
            {purchase.item.color}
          </span>

          <div className='flex space-x-3'>
            <button
              disabled={isDisabled}
              className={classNames('text-xs capitalize text-darkText/60 dark:text-lightText/60 desktop:text-sm ', {
                'hover:text-alertRed dark:hover:text-alertRed': !isDisabled,
                'cursor-not-allowed': isDisabled
              })}
              onClick={handleRemove}
            >
              {t('cart button.remove')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
