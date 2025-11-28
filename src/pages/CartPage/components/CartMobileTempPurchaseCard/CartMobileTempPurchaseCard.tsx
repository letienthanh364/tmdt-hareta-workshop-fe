import { faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import QuantityController from 'src/components/QuantityController'
import mainPath from 'src/constants/path'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ExtendedPurchase } from 'src/types/cart.type'

interface Props {
  purchase: ExtendedPurchase
  index: number
  handleChecking: (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleQuantity: (purchaseIndex: number, value: number, enable: boolean) => void
  handleTypeQuantity: (purchaseIndex: number) => (value: number) => void
  handleRemove: (purchaseIndex: number) => () => void
}

export default function CartMobileTempPurchaseCard(props: Props) {
  const { purchase, index, handleChecking, handleQuantity, handleRemove, handleTypeQuantity } = props

  const isDiscounted = purchase.item.price < purchase.item.original_price

  return (
    <div
      key={purchase.id}
      className='mt-2 flex items-center rounded-lg border border-black/10 bg-lightColor700 p-2 text-center text-darkText first:mt-0 dark:border-white/10 dark:bg-darkColor700 dark:text-lightText'
    >
      <div className='w-full space-y-2'>
        <div className='grid grid-cols-12 items-center justify-between'>
          <div className='col-span-1 flex flex-shrink-0 items-center justify-center'>
            <input
              type='checkbox'
              className='h-4 w-4 accent-primaryColor'
              checked={purchase.checked}
              onChange={handleChecking(index)}
            />
          </div>
          <p className='col-span-5 truncate text-center text-base font-semibold'>{purchase.item.name}</p>

          <div className='col-span-5 flex justify-center space-x-2 text-xs mobileLarge:text-sm'>
            <span
              className={classNames('text-darkText dark:text-lightText', {
                'line-through opacity-80': isDiscounted
              })}
            >
              ${formatCurrency(purchase.item.original_price)}
            </span>
            {isDiscounted && (
              <div className='flex justify-center space-x-2'>
                ${formatCurrency(purchase.item.price * ((100 - purchase.discount) / 100))}
              </div>
            )}
          </div>

          <button
            className='col-span-1 flex items-center bg-none p-1 text-darkText dark:text-lightText'
            onClick={handleRemove(index)}
          >
            <FontAwesomeIcon icon={faTrash} className='h-4 text-alertRed' />
          </button>
        </div>

        <div className='grid grid-cols-12 items-center'>
          <div className='col-span-1'></div>
          <div className='col-span-5'>
            <Link
              to={`${mainPath.store}/${generateNameId({
                name: purchase.item.name,
                id: purchase.item.id
              })}`}
              className='flex items-center justify-center'
            >
              <div className='relative flex w-[80%] flex-shrink-0 items-center overflow-hidden rounded-2xl bg-white pt-[80%] dark:bg-black tabletSmall:w-[60%] tabletSmall:pt-[60%]'>
                {purchase.item.avatar ? (
                  <img
                    alt={purchase.item.name}
                    src={purchase.item.avatar.url}
                    className='absolute left-0 top-0 h-full w-full object-scale-down'
                  />
                ) : (
                  <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-darkColor900 object-scale-down'>
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-12'>
          <div className='col-span-1'></div>
          <div className='col-span-5'>
            <QuantityController
              max={purchase.item.quantity}
              value={purchase.quantity}
              classNameWrapper='flex items-center justify-center'
              inputClassName='h-6 mx-2 w-12 text-xs rounded-md p-1 text-center outline-none text-haretaColor dark:bg-black bg-white'
              classNameButton='round flex items-center justify-center rounded-full bg-white p-1.5 text-darkText dark:bg-black dark:text-lightText'
              classNameIcon='h-3'
              onIncrease={(value) => handleQuantity(index, value, value <= purchase.item.quantity)}
              onDecrease={(value) => handleQuantity(index, value, value >= 1)}
              onType={handleTypeQuantity(index)}
              onFocusOut={(value) =>
                handleQuantity(
                  index,
                  value,
                  value >= 1 && value <= purchase.item.quantity && value !== purchase.previousQuantity
                )
              }
              disabled={purchase.disabled}
            />
          </div>

          <span className='col-span-5 text-sm font-semibold text-haretaColor mobileLarge:text-base'>
            ${formatCurrency(purchase.item.price * purchase.quantity * ((100 - purchase.discount) / 100))}
          </span>
        </div>
      </div>
    </div>
  )
}
