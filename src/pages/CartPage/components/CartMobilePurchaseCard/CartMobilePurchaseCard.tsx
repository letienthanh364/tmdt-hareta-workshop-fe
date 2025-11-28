import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { CartContext } from 'src/contexts/cart.context'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import purchaseApi from 'src/apis/cart.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

import QuantityController from 'src/components/QuantityController'
import classNames from 'classnames'
import { ExtendedPurchase } from 'src/types/cart.type'

interface Props {
  purchase: ExtendedPurchase
  index: number
  handleChecking: (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemove: (purchaseIndex: number) => () => void
}

export default function CartMobilePurchaseCard({ purchase, index, handleChecking, handleRemove }: Props) {
  const { setExtendedPurchases, unavailablePurchaseIds, setUnavailablePurchaseIds } = useContext(CartContext)

  const [quantity, setQuantity] = useState<number>(purchase.quantity)

  //! HANDLE QUANTITY
  const queryClient = useQueryClient()
  const updatePurchasesMutation = useMutation({
    mutationFn: purchaseApi.updatePurchases,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
    }
  })

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      setQuantity(value)
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].quantity = value
      })
    )
  }

  useEffect(() => {
    const updateQuantity = setTimeout(() => {
      updatePurchasesMutation.mutate({ id: purchase.id, quantity: quantity })
      const newUnavailablePurchaseIds = unavailablePurchaseIds.filter((id) => {
        return id != purchase.id
      })
      setUnavailablePurchaseIds(newUnavailablePurchaseIds)
    }, 1000)

    return () => clearTimeout(updateQuantity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase.id, quantity])

  //? is unavailable
  const unavailable = unavailablePurchaseIds.includes(purchase.id)

  const isDiscounted = purchase.item.price < purchase.item.original_price

  return (
    <div className='w-full space-y-2'>
      <div className='grid grid-cols-12 items-center justify-between'>
        <div className='col-span-1 flex flex-shrink-0 items-center justify-center'>
          <input
            name='is_selected'
            type='checkbox'
            className='h-4 w-4 accent-haretaColor'
            checked={purchase.checked}
            onChange={handleChecking(index)}
          />
        </div>
        <p
          className={classNames('col-span-5 truncate text-center text-base font-semibold', {
            'text-alertRed': unavailable
          })}
        >
          {purchase.item.name}
        </p>

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
            value={quantity}
            classNameWrapper='flex items-center justify-center'
            onIncrease={(value) => handleQuantity(index, value, value <= purchase.item.quantity)}
            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
            setQuantity={setQuantity}
            onType={handleTypeQuantity(index)}
            onFocusOut={(value) =>
              handleQuantity(
                index,
                value,
                value >= 1 && value <= purchase.item.quantity && value !== purchase.previousQuantity
              )
            }
            disabled={purchase.disabled}
            inputClassName={classNames(
              'h-6 text-sm desktop:text-base desktop:h-8 mx-1 desktop:mx-2 w-14 rounded-lg p-1 text-center outline-none dark:bg-black bg-white border border-black/20 dark:border-white/20',
              {
                'text-alertRed font-semibold': unavailable,
                'text-haretaColor font-medium': !unavailable
              }
            )}
          />
        </div>

        <span className='col-span-5 text-sm font-semibold text-haretaColor mobileLarge:text-base'>
          ${formatCurrency(purchase.item.price * purchase.quantity * ((100 - purchase.discount) / 100))}
        </span>
      </div>
    </div>
  )
}
