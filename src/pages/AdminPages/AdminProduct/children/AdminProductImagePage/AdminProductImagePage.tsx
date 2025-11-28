import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { AdminContext } from 'src/contexts/admin.context'
import producImageApi from 'src/apis/productImage.api'
import AdminSelectsVariant from '../../../components/AdminSelectsVariant'
import AdminSelectProductGroup from '../../../components/AdminSelectProductGroup'
import AdminProductImageHeader from '../../components/AdminProductImageHeader'
import AdminImageInput from '../../../components/AdminImageInput'
import { showSuccessDialog } from 'src/utils/utils'
import LoadingRing from 'src/components/LoadingRing'
import { AppContext } from 'src/contexts/app.context'
import AdminDialog from '../../../components/AdminDialog'

export default function AdminProductImagePage() {
  const { currentProduct, productGroup } = useContext(AdminContext)
  const { setLoadingPage } = useContext(AppContext)

  const [avatarFile, setAvatarFile] = useState<File>()
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false)
  const [deletedSuccess, setDeletedSuccess] = useState<boolean>(false)

  const previewImage = useMemo(() => {
    return avatarFile ? URL.createObjectURL(avatarFile) : ''
  }, [avatarFile])

  const handleChangeAvatarFile = (file?: File) => {
    setAvatarFile(file)
  }

  //! Get image list
  const queryClient = useQueryClient()
  const {
    data: itemImageListData,
    isFetched,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['products', currentProduct?.id, 'images'],
    queryFn: () => producImageApi.getImageList(currentProduct?.id as string),

    enabled: Boolean(currentProduct)
  })
  const imageList = itemImageListData?.data.data
  // const imageList = useMemo(() => itemImageListData?.data.data, [itemImageListData?.data.data])
  useEffect(() => {
    if (currentProduct) {
      refetch()
    }
  }, [currentProduct, refetch])

  //! Handle add image
  const addImageMuation = useMutation({ mutationFn: producImageApi.addImage })
  const handleSubmit = () => {
    setLoadingPage(true)
    if (avatarFile && currentProduct) {
      const body = {
        item_id: currentProduct.id,
        color: currentProduct.color,
        file: avatarFile
      }
      addImageMuation.mutate(body, {
        onSuccess: () => {
          showSuccessDialog(setAddedSuccess)
          queryClient.invalidateQueries({ queryKey: ['products', currentProduct?.id, 'images'] })
        },
        onError: (error) => {
          console.log(error)
        },
        onSettled: () => setLoadingPage(false)
      })
    }
  }

  //! Handle delete image
  const deleteImageMutation = useMutation({ mutationFn: producImageApi.deleteImage })
  const handleDelete = (imageId: string) => () => {
    setLoadingPage(true)
    deleteImageMutation.mutate(
      { id: imageId },
      {
        onSuccess: () => {
          showSuccessDialog(setDeletedSuccess)
          queryClient.invalidateQueries({ queryKey: ['products', currentProduct?.id, 'images'] })
        },
        onSettled: () => {
          setLoadingPage(false)
        }
      }
    )
  }

  return (
    <div>
      <AdminProductImageHeader />
      <div className=' mt-4 grid grid-cols-2 gap-4'>
        <div className='col-span-1'>
          <div className='flex min-h-full flex-col justify-between space-y-4'>
            <AdminSelectProductGroup />
            <AdminSelectsVariant />
          </div>
        </div>

        <div className='col-span-1'>
          <div className='sticky top-6 rounded-lg border border-white/40'>
            <div className='grid grid-cols-2 gap-6 p-2'>
              <div className='col-span-1'>
                <div className='relative w-full overflow-hidden rounded-md pt-[75%]'>
                  {currentProduct && (
                    <Fragment>
                      {avatarFile && (
                        <img
                          src={previewImage}
                          alt={currentProduct?.name}
                          className='absolute left-0 top-0 h-full w-full object-scale-down'
                        />
                      )}
                      {!avatarFile && <div className='absolute left-0 top-0 h-full w-full bg-black/50'></div>}
                      <div className='absolute bottom-1 left-1/2 w-1/2 -translate-x-1/2 rounded-lg border border-white/20 bg-black px-2 py-1'>
                        <AdminImageInput onChangeImageFile={handleChangeAvatarFile} />
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
              <div className='col-span-1'>
                <div className='flex h-full flex-col justify-around'>
                  <div className='grid grid-cols-3 gap-4'>
                    <p className='col-span-1 font-medium uppercase text-primaryBlue'>ID</p>
                    <p className='col-span-2 line-clamp-1 capitalize text-haretaColor'>{currentProduct?.id}</p>
                  </div>
                  <div className='grid grid-cols-3 gap-4'>
                    <p className='col-span-1 font-medium uppercase text-primaryBlue'>Tên</p>
                    <p className='col-span-2 line-clamp-1 capitalize text-haretaColor'>{productGroup?.name}</p>
                  </div>
                  <div className='grid grid-cols-3 gap-4'>
                    <p className='col-span-1 font-medium uppercase text-primaryBlue'>Màu</p>
                    <p className='col-span-2 line-clamp-1 capitalize text-haretaColor'>{currentProduct?.color}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className=' flex w-full items-center justify-end px-4'>
              <div className='relative'>
                <button
                  className='flex items-center justify-center rounded-lg bg-unhoveringBg px-4 py-1 hover:bg-hoveringBg'
                  onClick={handleSubmit}
                >
                  Thêm hình ảnh
                </button>
                {!avatarFile && <div className='absolute inset-0 bg-black/50'></div>}
              </div>
            </div>
            <div className='mt-4 space-y-4 p-4'>
              <p className='text-center text-lg font-medium uppercase text-white'>Danh sách hình ảnh</p>
              <div className='h-80 overflow-hidden rounded-lg border border-white/60'>
                {isFetching && (
                  <div className='inset-0 flex h-full w-full items-center justify-center bg-black/50'>
                    <LoadingRing />
                  </div>
                )}
                {isFetched && (
                  <div className='m-2 grid grid-cols-3 gap-4'>
                    {imageList?.map((image) => (
                      <div
                        key={image.id}
                        className='relative col-span-1 w-full overflow-hidden rounded-xl border border-white/40 pt-[75%]'
                      >
                        {image.image ? (
                          <img
                            src={image.image.url}
                            alt={image.id}
                            className='absolute left-0 top-0 h-full w-full object-scale-down'
                          />
                        ) : (
                          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                            <FontAwesomeIcon icon={faTriangleExclamation} fontSize={10} />
                          </div>
                        )}
                        <button
                          onClick={handleDelete(image.id)}
                          className='absolute right-1 top-1 rounded-xl bg-alertRed/80 px-2 py-1 text-sm hover:bg-alertRed'
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDialog isOpen={addedSuccess} setIsOpen={setAddedSuccess} content='Đã thêm hình ảnh' />

      <AdminDialog isOpen={deletedSuccess} setIsOpen={setDeletedSuccess} content='Đã xóa hình ảnh' />
    </div>
  )
}
