import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import { adminProductApi, UpdateProductForm } from 'src/apis/admin.api'
import CustomReachDialog from 'src/components/CustomReachDialog'
import LoadingSection from 'src/components/LoadingSection'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import { ProductType } from 'src/types/product.type'
import { ErrorRespone } from 'src/types/utils.type'
import { formatCurrency, isAxiosBadRequestError } from 'src/utils/utils'

interface Props {
  product: ProductType
  discount: number
  handleRemove: (productId: string) => () => void
  isAddingProduct: boolean
}

export default function AdminEventProductCard({ product, handleRemove, isAddingProduct }: Props) {
  const isDiscounted = product.price < product.original_price

  const [updatingPrice, setUpdatingPrice] = useState(false)
  const [newPrice, setNewPrice] = useState<number>(product.price)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [dialog, setDialog] = useState(false)
  const [excuting, setExcuting] = useState(false)
  const [updateError, setUpdateError] = useState(false)

  //! Handle input
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setNewPrice(Number(newValue))
    }
  }

  //! Update price
  const updateProductMutation = useMutation({ mutationFn: adminProductApi.updateProduct })
  const queryClient = useQueryClient()
  const updatePrice = () => {
    setUpdateError(false)
    setErrorMessage('')
    setDialog(true)
    setExcuting(true)
    if (newPrice > product.original_price) {
      setExcuting(false)
      setUpdateError(true)
      setErrorMessage('Giá khuyến mãi lớn hơn giá gốc')
      return
    }
    const body: UpdateProductForm = {
      id: product.id,
      price: newPrice
    }
    updateProductMutation.mutate(body, {
      onSettled: () => {
        setUpdatingPrice(false)
        setExcuting(false)
      },
      onSuccess: () => {
        setUpdateError(false)
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      },
      onError: (error) => {
        if (isAxiosBadRequestError<ErrorRespone>(error)) {
          const formError = error.response?.data
          if (formError) {
            const errorMessage = HttpStatusMessage.get(formError.error_key)
            setErrorMessage(errorMessage || '')
          }
        }
      }
    })
    return
  }

  return (
    <div className='relative w-full overflow-hidden rounded-xl bg-productLightBg pb-4 duration-200 dark:bg-productDarkBg'>
      <div className='relative w-full pt-[75%]'>
        <div className='absolute left-0 top-0 h-full w-full'>
          {product.avatar?.url ? (
            <img
              src={product.avatar.url}
              alt={product.name}
              className='absolute left-0 top-0 h-full w-full object-cover'
            />
          ) : (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
            </div>
          )}
        </div>

        {!isDiscounted && (
          <div className='absolute bottom-2 flex items-center justify-center bg-alertRed p-2 text-center font-medium'>
            Chưa cập nhật giá khuyến mãi cho sản phẩm này
          </div>
        )}
      </div>
      <div className='flex flex-col items-center justify-between space-x-1 space-y-1 overflow-hidden px-2 pt-2 tabletSmall:px-3 desktop:px-4 desktop:pt-4'>
        <p className='h-full justify-center overflow-hidden truncate text-center text-sm font-semibold uppercase text-darkText duration-200 dark:text-lightText tabletSmall:text-base desktop:text-lg'>
          {product.name}
        </p>

        <p className='h-full justify-center overflow-hidden truncate text-center text-xs uppercase text-darkText opacity-60 duration-200 dark:text-lightText desktop:text-sm'>
          {product.color}
        </p>

        <div className='flex w-full items-center justify-center space-x-2'>
          <span className='text-xs font-semibold line-through opacity-60 tabletSmall:text-sm desktop:text-base desktopLarge:text-lg'>
            ${formatCurrency(product.original_price)}
          </span>
          {!updatingPrice && (
            <span className='px-2 py-1 text-xs font-semibold text-haretaColor tabletSmall:text-sm desktop:text-base desktopLarge:text-lg'>
              ${formatCurrency(product.price)}
            </span>
          )}
          {updatingPrice && (
            <input
              type='text'
              className='w-16 rounded-xl px-2 py-1 text-haretaColor outline-none focus:outline-2 focus:outline-primaryColor'
              value={newPrice}
              onChange={onChange}
            />
          )}
        </div>
        <div className='flex w-full justify-around'>
          {!updatingPrice && (
            <button
              onClick={() => {
                setUpdatingPrice(true)
              }}
              className='rounded-xl bg-unhoveringBg px-2 py-1 text-sm hover:bg-hoveringBg'
            >
              Cập nhật giá
            </button>
          )}
          {updatingPrice && (
            <Fragment>
              <button
                onClick={() => {
                  setNewPrice(product.price)
                  setUpdatingPrice(false)
                }}
                className='rounded-xl border border-white/60 px-2 py-1 text-sm'
              >
                Hủy
              </button>
              <button
                onClick={updatePrice}
                className='rounded-xl bg-primaryBlue/80 px-2 py-1 text-sm hover:bg-primaryBlue'
              >
                Lưu
              </button>
            </Fragment>
          )}
        </div>
      </div>

      {isAddingProduct && (
        <button
          onClick={handleRemove(product.id)}
          className='absolute right-1 top-1 w-6/12 rounded-xl bg-alertRed/80 px-3 py-1 text-sm hover:bg-alertRed'
        >
          Xóa
        </button>
      )}

      <CustomReachDialog
        isOpen={dialog}
        handleClose={() => {
          setDialog(false)
        }}
        closeButton
      >
        {excuting && <LoadingSection className='flex h-40 w-full items-center justify-center' />}
        {!excuting && (
          <Fragment>
            {!updateError && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>
                Đã cập nhật giá tiền sản phẩm
              </p>
            )}
            {updateError && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>
                {errorMessage || 'Đã có lỗi xảy ra, vui lòng thử lại sau'}
              </p>
            )}
          </Fragment>
        )}
      </CustomReachDialog>
    </div>
  )
}
