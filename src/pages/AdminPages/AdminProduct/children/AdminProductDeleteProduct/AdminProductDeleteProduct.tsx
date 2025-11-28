import { Fragment, useContext, useState } from 'react'
import AdminProductDeleteHeader from '../../components/AdminProductDeleteHeader'
import AdminSelectsVariant from '../../../components/AdminSelectsVariant'
import { AdminContext } from 'src/contexts/admin.context'
import DialogPopup from 'src/components/DialogPopup'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminProductApi } from 'src/apis/admin.api'
import { showSuccessDialog } from 'src/utils/utils'
import AdminDialog from '../../../components/AdminDialog'
import AdminInforSection from '../../../components/AdminInforSection'
import AdminSelectProductGroup from '../../../components/AdminSelectProductGroup'

export default function AdminProductDeleteProduct() {
  const { currentProduct, setCurrentProduct, productGroup } = useContext(AdminContext)
  const { setLoadingPage } = useContext(AppContext)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [dialog, setDialog] = useState(false)

  //? HANDLE DELETE
  const queryClient = useQueryClient()
  const onClickDelete = () => {
    setConfirmDialog(true)
  }

  const deleteItemMutation = useMutation({ mutationFn: adminProductApi.deleteProduct })
  const handleDelete = () => {
    setConfirmDialog(false)
    setLoadingPage(true)
    deleteItemMutation.mutate(
      { id: currentProduct?.id as string },
      {
        onSuccess: () => {
          showSuccessDialog(setDialog)
          queryClient.invalidateQueries({ queryKey: ['product-groups', 'variants', productGroup?.id] })
          queryClient.invalidateQueries({ queryKey: ['product-groups'] })
          queryClient.invalidateQueries({ queryKey: ['products'] })
          setCurrentProduct(null)
        }
      }
    )
    setLoadingPage(false)
  }

  return (
    <div>
      <AdminProductDeleteHeader />
      <div className='mt-4 grid grid-cols-2 gap-4'>
        <div className='col-span-1'>
          <div className='sticky top-6 space-y-4'>
            <AdminSelectProductGroup />
            <AdminSelectsVariant />
          </div>
        </div>
        <div className='col-span-1'>
          <div className='relative min-h-screen space-y-4 rounded-lg border border-white/40 p-4'>
            {!currentProduct && (
              <div className='flex h-20 items-center justify-center text-2xl font-bold uppercase text-alertRed'>
                Chọn 1 sản phẩm
              </div>
            )}
            {currentProduct && (
              <Fragment>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <p className='col-span-1 text-sm font-medium uppercase text-white/60'>Ảnh đại diện</p>
                  <div className='col-span-2'>
                    <div className='relative w-full pt-[75%]'>
                      <img
                        src={currentProduct.avatar?.url || ''}
                        alt={`${currentProduct.name} ${currentProduct.color}`}
                        className='absolute left-0 top-0 h-full w-full object-scale-down'
                      />
                    </div>
                  </div>
                </div>

                <AdminInforSection title='Nhóm sản phẩm' infor={productGroup?.name ?? ''} />
                <AdminInforSection title='ID' infor={currentProduct.id} />
                <AdminInforSection title='Tên sản phẩm' infor={currentProduct.name} />
                <AdminInforSection title='Màu' infor={currentProduct.color} />
                <AdminInforSection title='Hạng mục' infor={currentProduct.category} />
                <AdminInforSection title='Bộ sưu tập' infor={currentProduct.collection} />
                <AdminInforSection title='Loại' infor={currentProduct.type} />
                <AdminInforSection title='Dòng sản phẩm' infor={currentProduct.product_line} />
                <AdminInforSection title='Số lượng' infor={currentProduct.quantity} />
                <AdminInforSection title='Giá' infor={currentProduct.price} />
                <AdminInforSection title='Giảm giá' infor={currentProduct.discount} />
                <AdminInforSection title='Tag' infor={currentProduct.tag} />
                <AdminInforSection title='Lượt thích' infor={currentProduct.like_count} />
                <AdminInforSection title='Đã bán' infor={currentProduct.sold} />
                <AdminInforSection title='cron status' infor={currentProduct.cron_status} />
                <AdminInforSection title='Ngày tạo' infor={currentProduct.created_at} isDate />
                <AdminInforSection title='Ngày chỉnh sửa' infor={currentProduct.updated_at} isDate />
              </Fragment>
            )}
          </div>
          {currentProduct && (
            <div className='mt-4  flex w-full items-center justify-end'>
              <button
                className='rounded-lg bg-alertRed/80 px-4 py-2 text-sm uppercase hover:bg-alertRed desktop:text-base'
                onClick={onClickDelete}
              >
                xóa
              </button>
            </div>
          )}
        </div>
      </div>
      <DialogPopup
        isOpen={confirmDialog}
        handleClose={() => {
          setConfirmDialog(false)
        }}
      >
        <p className='text-center text-xl font-semibold uppercase leading-6'>Xóa sản phẩm?</p>
        <div className='mt-8 flex justify-between'>
          <button
            type='button'
            className='flex items-center justify-center rounded-md bg-blue-100 px-4 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200'
            onClick={() => setConfirmDialog(false)}
          >
            Hủy
          </button>
          <button
            type='button'
            className='flex items-center justify-center rounded-md bg-alertRed/80 px-4 py-1 text-sm font-medium hover:bg-alertRed'
            onClick={handleDelete}
          >
            Xóa
          </button>
        </div>
      </DialogPopup>
      <AdminDialog isOpen={dialog} setIsOpen={setDialog} content='Đã xóa sản phẩm' />
    </div>
  )
}
