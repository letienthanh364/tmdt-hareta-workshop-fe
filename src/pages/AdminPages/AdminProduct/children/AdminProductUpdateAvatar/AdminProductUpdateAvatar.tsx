import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { AdminContext } from 'src/contexts/admin.context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminProductApi } from 'src/apis/admin.api'
import { showSuccessDialog } from 'src/utils/utils'
import producImageApi from 'src/apis/productImage.api'

import { AppContext } from 'src/contexts/app.context'
import AdminProductImageHeader from '../../components/AdminProductImageHeader'
import AdminSelectProductGroup from 'src/pages/AdminPages/components/AdminSelectProductGroup'
import AdminSelectsVariant from 'src/pages/AdminPages/components/AdminSelectsVariant'
import AdminImageInput from 'src/pages/AdminPages/components/AdminImageInput'
import AdminDialog from 'src/pages/AdminPages/components/AdminDialog'

export default function AdminProductUpdateAvatar() {
  const { setLoadingPage } = useContext(AppContext)
  const { currentProduct } = useContext(AdminContext)

  const [avatarFile, setAvatarFile] = useState<File>()
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false)

  const previewImage = useMemo(() => {
    return avatarFile ? URL.createObjectURL(avatarFile) : ''
  }, [avatarFile])

  const avatar = currentProduct?.avatar?.url || ''

  //? GET IMAGE LIST
  const { data: itemImageListData, refetch } = useQuery({
    queryKey: ['products', currentProduct?.id, 'images'],
    queryFn: () => producImageApi.getImageList(currentProduct?.id as string),

    enabled: Boolean(currentProduct)
  })
  const imageList = itemImageListData?.data.data
  useEffect(() => {
    if (currentProduct) {
      refetch()
    }
  }, [currentProduct, refetch])

  //? AUTO ADD FIRST IMAGE
  const addProductImageMutation = useMutation({ mutationFn: producImageApi.addImage })

  //? UPLOAD AVATAR
  const queryClient = useQueryClient()
  const uploadAvatarMutation = useMutation({ mutationFn: adminProductApi.uploadProductAvatar })
  const handleSubmit = () => {
    setLoadingPage(true)
    if (avatarFile && currentProduct) {
      const body = {
        id: currentProduct.id as string,
        file: avatarFile
      }
      if (imageList?.length === 0) {
        const addImageBody = {
          item_id: currentProduct.id,
          color: currentProduct.color,
          file: avatarFile
        }
        addProductImageMutation.mutate(addImageBody, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', currentProduct?.id, 'images'] })
          },
          onSettled: () => {
            setLoadingPage(false)
          }
        })
      }
      setLoadingPage(true)
      uploadAvatarMutation.mutate(body, {
        onSettled: () => {
          setLoadingPage(false)
        },
        onSuccess: () => {
          showSuccessDialog(setSuccessDialogOpen)
          queryClient.invalidateQueries({ queryKey: ['products', currentProduct.id] })
          queryClient.invalidateQueries({ queryKey: ['products'] })
          queryClient.invalidateQueries({ queryKey: ['product-groups'] })
        },
        onError: (error) => {
          console.log(error)
        }
      })
    }
  }

  const handleChangeAvatarFile = (file?: File) => {
    setAvatarFile(file)
  }

  return (
    <div>
      <AdminProductImageHeader />
      <div className='mt-4 grid grid-cols-12 gap-4'>
        <div className='col-span-6 space-y-4'>
          <AdminSelectProductGroup />
          <AdminSelectsVariant />
        </div>

        <div className='col-span-6'>
          <div className='relative rounded-lg border border-white/40 p-4'>
            <div className='relative w-full pt-[75%]'>
              {currentProduct && (
                <Fragment>
                  <img
                    src={previewImage || avatar}
                    alt={currentProduct?.name}
                    className='absolute left-0 top-0 h-full w-full object-scale-down'
                  />
                  <div className='absolute bottom-1 left-1/2 w-1/4 -translate-x-1/2 rounded-lg border border-white/20 bg-black px-2 py-1'>
                    <AdminImageInput onChangeImageFile={handleChangeAvatarFile} />
                  </div>
                </Fragment>
              )}
            </div>
            <div className='mt-10 space-y-4'>
              <div className='grid grid-cols-2'>
                <div className='col-span-1'>
                  <p className='text-base font-medium uppercase text-white/60 desktop:text-lg'>Tên sản phẩm</p>
                </div>
                <div className='col-span-1'>
                  <p className='text-base font-medium uppercase desktop:text-lg'>{currentProduct?.name}</p>
                </div>
              </div>
              <div className='grid grid-cols-2'>
                <div className='col-span-1'>
                  <p className='text-base font-medium uppercase text-white/60 desktop:text-lg'>Màu</p>
                </div>
                <div className='col-span-1'>
                  <p className='text-base font-medium uppercase desktop:text-lg'>{currentProduct?.color}</p>
                </div>
              </div>
              {currentProduct && (
                <div className='flex w-full justify-end'>
                  <button
                    className='rounded-lg bg-unhoveringBg px-4 py-2 text-darkText hover:bg-hoveringBg'
                    onClick={handleSubmit}
                  >
                    Xác nhận
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminDialog
        isOpen={successDialogOpen}
        setIsOpen={setSuccessDialogOpen}
        content='Cập nhật ảnh sản phẩm thành công'
      />
    </div>
  )
}
