import { Fragment, useState } from 'react'
import { Image, ImageListConfig } from 'src/types/image.type'
import { formatDate } from 'src/utils/utils'
import AdminImageFilter from '../../components/AdminImageFilter'
import LoadingRing from 'src/components/LoadingRing'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { imageApi } from 'src/apis/image.api'
import useImageListQueryConfig from 'src/hooks/useImageListQueryConfig'
import DialogPopup from 'src/components/DialogPopup'

function ImageItem({ image, handleDelete }: { image: Image; handleDelete: (imageId: string) => () => void }) {
  const [hoveringImage, setHoveringImage] = useState<boolean>(false)

  return (
    <div
      className='relative w-full overflow-hidden rounded-md border  border-white/40 pt-[75%]'
      onMouseEnter={() => setHoveringImage(true)}
      onMouseLeave={() => setHoveringImage(false)}
    >
      <img src={image.url} alt='Error URL' className='absolute left-0 top-0 h-full w-full object-scale-down' />
      {hoveringImage && (
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between bg-black/60 px-2 py-1'>
          <div className='flex space-x-1 text-xs text-white tablet:space-x-2 tablet:text-sm'>
            <p className='font-semibold'>Ngày tải lên:</p>
            <p className=''>{formatDate(image.created_at)}</p>
          </div>
          <button
            className='rounded-md bg-alertRed/80 px-2 py-0.5 text-sm hover:bg-alertRed tablet:px-4 tablet:py-1 tablet:text-base'
            onClick={handleDelete(image.id)}
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminImageDelete() {
  const [excutingDialog, setExcutingDialog] = useState<boolean>(false)

  //! GET IMAGE LIST
  const imagesConfig = useImageListQueryConfig()

  const {
    data: imagesData,
    isFetching,
    isFetched
  } = useQuery({
    queryKey: ['images', imagesConfig],
    queryFn: () => {
      return imageApi.getImageList(imagesConfig as ImageListConfig)
    },
    staleTime: 3 * 60 * 1000
  })

  //! HANDLE DELETE
  const queryClient = useQueryClient()
  const deleteImageMutation = useMutation({
    mutationFn: imageApi.deleteImage
  })
  const handleDelete = (imageId: string) => () => {
    setExcutingDialog(true)
    deleteImageMutation.mutate(
      { image_id: imageId as string },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['images'] })
        }
      }
    )
  }

  return (
    <Fragment>
      <AdminImageFilter />
      <div className='mt-4'>
        {(isFetching || !imagesData) && (
          <div className='flex h-80 w-full items-center justify-center'>
            <LoadingRing />
          </div>
        )}
        {isFetched && imagesData && (
          <div className='grid grid-cols-2 gap-2 tablet:grid-cols-3 desktop:grid-cols-4 '>
            {imagesData.data.data.map((image) => (
              <div className='col-span-1' key={image.id}>
                <ImageItem image={image} handleDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
      <DialogPopup
        isOpen={excutingDialog}
        handleClose={() => {
          setExcutingDialog(false)
        }}
      >
        {deleteImageMutation.isPending && <LoadingRing />}
        {deleteImageMutation.isSuccess && (
          <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>Đã xóa hình ảnh</p>
        )}
      </DialogPopup>
    </Fragment>
  )
}
