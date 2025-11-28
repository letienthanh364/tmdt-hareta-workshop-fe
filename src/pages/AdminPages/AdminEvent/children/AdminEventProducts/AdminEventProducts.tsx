import { useMutation, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useContext, useState } from 'react'
import eventApi from 'src/apis/event.api'
import { AdminContext } from 'src/contexts/admin.context'
import { AppContext } from 'src/contexts/app.context'
import { productQuery } from 'src/hooks/queries/useProductQuery'
import AdminDialog from 'src/pages/AdminPages/components/AdminDialog'
import AdminSelectProductGroup from 'src/pages/AdminPages/components/AdminSelectProductGroup'
import AdminSelectsVariant from 'src/pages/AdminPages/components/AdminSelectsVariant'

interface Props {
  eventId: string
  productsInEvents: string[]
  setIsAddingProduct: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AdminEventProducts({ eventId, setIsAddingProduct, productsInEvents }: Props) {
  const { setLoadingPage } = useContext(AppContext)
  const { productGroup, currentProduct } = useContext(AdminContext)

  const [successDialog, setSuccessDialog] = useState(false)

  //! Handle add product
  const queryClient = useQueryClient()
  const addProductToEventMutation = useMutation({ mutationFn: eventApi.addProductToEvent })
  const addProductToEvent = () => {
    setLoadingPage(true)
    const body = {
      event_id: eventId,
      item_id: currentProduct?.id as string
    }
    addProductToEventMutation.mutate(body, {
      onSettled: () => {
        setLoadingPage(false)
      },
      onSuccess: () => {
        setSuccessDialog(true)
        queryClient.invalidateQueries({ queryKey: ['events', 'detail', eventId] })
      },
      onError: (error) => {
        console.error(error)
      }
    })
  }

  //! Handle add all product in group
  const { data: productsInGroupData } = productQuery.useGetProductsInGroup(
    {
      id: productGroup?.id as string,
      page: '1',
      limit: '50'
    },
    Boolean(productGroup)
  )
  const productsInGroup = productsInGroupData?.data.data || []

  const addAllProducts = async () => {
    setLoadingPage(true)
    for (const product of productsInGroup) {
      if (productsInEvents.includes(product.id)) continue
      const body = {
        event_id: eventId,
        item_id: product.id
      }
      await addProductToEventMutation.mutateAsync(body, {
        onError: (error) => {
          console.error(error)
          setLoadingPage(false)
          return
        }
      })
    }
    setLoadingPage(false)
    setSuccessDialog(true)
    queryClient.invalidateQueries({ queryKey: ['events', 'detail', eventId] })
  }

  //! Style
  const buttonStyle = 'rounded-xl bg-unhoveringBg px-6 py-2 font-medium text-darkText hover:bg-hoveringBg'

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-around'>
        <p className='desktop:tetx-xl text-center text-lg font-semibold uppercase text-primaryBlue'>
          Thêm / xóa sản phẩm trong sự kiện
        </p>
        <button
          onClick={() => {
            setIsAddingProduct(false)
          }}
          className={'rounded-xl bg-alertRed/80 px-6 py-2 font-medium text-darkText hover:bg-alertRed'}
        >
          Hủy
        </button>
      </div>

      <div className='gird-cols-1 grid gap-4 desktop:grid-cols-2 desktop:gap-0'>
        <div className='col-span-1 space-y-4 px-4 desktop:border-r'>
          <AdminSelectProductGroup />
          <div className='flex items-center justify-center space-x-4'>
            <p className='text-center text-lg font-medium uppercase'>Thêm tất cả sản phẩm trong nhóm</p>
            <button onClick={addAllProducts} className={buttonStyle}>
              Thêm tất cả
            </button>
          </div>
        </div>
        <div className='col-span-1 space-y-4 px-4'>
          <AdminSelectsVariant />
          <div
            className={classNames('flex items-center justify-center space-x-4', {
              'opacity-50': !currentProduct
            })}
          >
            <p className='text-lg font-medium uppercase'>Thêm sản phẩm được chọn</p>
            <button
              onClick={addProductToEvent}
              disabled={!currentProduct}
              className={classNames(buttonStyle, {
                'cursor-not-allowed hover:bg-unhoveringBg': !currentProduct
              })}
            >
              Thêm
            </button>
          </div>
        </div>
      </div>

      <AdminDialog isOpen={successDialog} setIsOpen={setSuccessDialog} content='Đã thêm sản phẩm' />
    </div>
  )
}
