import { Fragment, useContext, useState } from 'react'
import AdminProductDeleteHeader from '../../components/AdminProductDeleteHeader'
import { AdminContext } from 'src/contexts/admin.context'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { showSuccessDialog } from 'src/utils/utils'
import productApi from 'src/apis/product.api'
import DialogPopup from 'src/components/DialogPopup'
import AdminDialog from '../../../components/AdminDialog'
import { adminProductGroupApi } from 'src/apis/admin.api'
import AdminSelectProductGroup from '../../../components/AdminSelectProductGroup'
import AdminInforSection from '../../../components/AdminInforSection'
import LoadingSection from 'src/components/LoadingSection'
import AdminSelectsVariant from '../../../components/AdminSelectsVariant'

export default function AdminProductDeleteGroup() {
  const { productGroup, setProductGroup, currentProduct } = useContext(AdminContext)
  const { setLoadingPage } = useContext(AppContext)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [dialog, setDialog] = useState(false)

  //! Get product detail
  const { data: productDetailData, isFetching: fetchingProductDetail } = useQuery({
    queryKey: ['products', currentProduct?.id],
    queryFn: () => productApi.getProductDetail(currentProduct?.id as string),
    enabled: Boolean(currentProduct)
  })
  const productDetail = productDetailData?.data.data

  //! HANDLE DELETE
  const queryClient = useQueryClient()
  const onClickDelete = () => {
    setConfirmDialog(true)
  }

  const deleteProductGroupMutation = useMutation({ mutationFn: adminProductGroupApi.deleteProductGroup })
  const handleDelete = () => {
    setConfirmDialog(false)
    setLoadingPage(true)

    deleteProductGroupMutation.mutate(
      { id: productGroup?.id as string },
      {
        onSuccess: () => {
          showSuccessDialog(setDialog)
          queryClient.invalidateQueries({ queryKey: ['product-groups'] })
          queryClient.invalidateQueries({ queryKey: ['products'] })
          queryClient.invalidateQueries({ queryKey: ['product-groups', productGroup?.id] })
          setProductGroup(null)
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
            {!productGroup && (
              <div className='flex h-20 items-center justify-center text-2xl font-bold uppercase text-alertRed'>
                Chọn 1 nhóm sản phẩm
              </div>
            )}
            {productGroup && (
              <Fragment>
                <p className='text-center text-xl font-semibold'>Thông tin nhóm sản phẩm</p>
                <AdminInforSection title='Nhóm sản phẩm' infor={productGroup?.name ?? ''} />
                <AdminInforSection title='ID nhóm' infor={productGroup?.id ?? ''} />

                <p className='pt-6 text-center text-xl font-semibold'>Thông tin từng sản phẩm</p>
                {!currentProduct && (
                  <div className='flex h-20 items-center justify-center text-2xl font-bold uppercase text-alertRed'>
                    Chọn 1 sản phẩm
                  </div>
                )}
                {fetchingProductDetail && <LoadingSection />}
                {productDetail && (
                  <Fragment>
                    <div className='grid grid-cols-3 items-center gap-4'>
                      <p className='col-span-1 text-sm font-medium uppercase text-white/60'>Ảnh đại diện</p>
                      <div className='col-span-2'>
                        <div className='relative w-full pt-[75%]'>
                          <img
                            src={productDetail.avatar?.url || ''}
                            alt={`${productDetail.name} ${productDetail.color}`}
                            className='absolute left-0 top-0 h-full w-full object-scale-down'
                          />
                        </div>
                      </div>
                    </div>

                    <AdminInforSection title='ID' infor={productDetail.id ?? ''} />
                    <AdminInforSection title='Tên sản phẩm' infor={productDetail.name ?? ''} />
                    <AdminInforSection title='Màu' infor={productDetail.color ?? ''} />
                    <AdminInforSection title='Hạng mục' infor={productDetail.category ?? ''} />
                    <AdminInforSection title='Bộ sưu tập' infor={productDetail.collection ?? ''} />
                    <AdminInforSection title='Loại' infor={productDetail.type ?? ''} />
                    <AdminInforSection title='Dòng sản phẩm' infor={productDetail.product_line ?? ''} />
                    <AdminInforSection title='Số lượng' infor={productDetail.quantity ?? ''} />
                    <AdminInforSection title='Giá' infor={productDetail.price ?? ''} />
                    <AdminInforSection title='Giảm giá' infor={productDetail.discount ?? ''} />
                    <AdminInforSection title='Tag' infor={productDetail.tag ?? ''} />
                    <AdminInforSection title='Lượt thích' infor={productDetail.like_count ?? ''} />
                    <AdminInforSection title='Đã bán' infor={productDetail.sold ?? ''} />
                    <AdminInforSection title='cron status' infor={productDetail.cron_status ?? ''} />
                    <AdminInforSection title='Ngày tạo' infor={productDetail.created_at ?? ''} isDate />
                    <AdminInforSection title='Ngày chỉnh sửa' infor={productDetail.updated_at ?? ''} isDate />
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
          {productGroup && (
            <div className='mt-4 flex w-full items-center justify-end'>
              <button
                className='rounded-lg bg-red-600/80 px-4 py-2 text-sm uppercase hover:bg-red-600 desktop:text-base'
                onClick={onClickDelete}
              >
                Xóa
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
        <div className='w-96'>
          <p className='text-center text-3xl font-bold uppercase leading-6 text-alertRed'>Hành động nguy hiểm</p>

          <p className='mt-6 text-center text-xl font-medium uppercase'>
            Xóa một nhóm sản phẩm sẽ xóa tất cả các sản phẩm trong nhóm
          </p>

          <p className='mt-8 text-center text-lg font-medium leading-6'>Bạn có chắc muốn xóa nhóm sản phẩm này?</p>
          <div className='mt-4 flex justify-between'>
            <button
              type='button'
              className='flex items-center justify-center rounded-md bg-blue-100 px-4 py-1 font-medium text-blue-900 hover:bg-blue-200'
              onClick={() => setConfirmDialog(false)}
            >
              Hủy
            </button>
            <button
              type='button'
              className='flex items-center justify-center rounded-md bg-alertRed/80 px-4 py-1 font-medium hover:bg-alertRed'
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </DialogPopup>
      <AdminDialog isOpen={dialog} setIsOpen={setDialog} content='Đã xóa nhóm sản phẩm' />
    </div>
  )
}
