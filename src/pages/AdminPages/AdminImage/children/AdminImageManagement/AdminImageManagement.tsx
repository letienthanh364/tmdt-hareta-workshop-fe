import { useQuery } from '@tanstack/react-query'
import { Slide, toast } from 'react-toastify'
import { imageApi } from 'src/apis/image.api'
import { useCopyToClipboard } from 'src/hooks/useCopyToClipboard'
import useImageListQueryConfig from 'src/hooks/useImageListQueryConfig'
import { ImageListConfig } from 'src/types/image.type'
import LoadingRing from 'src/components/LoadingRing'
import ImageCard from 'src/components/ImageCard'
import AdminImageFilter from '../../components/AdminImageFilter'

export default function AdminImageManagement() {
  //! GET IMAGE LIST
  const imagesConfig = useImageListQueryConfig()

  const { data: imagesData, isFetching } = useQuery({
    queryKey: ['images', imagesConfig],
    queryFn: () => {
      return imageApi.getImageList(imagesConfig as ImageListConfig)
    },
    staleTime: 3 * 60 * 1000
  })

  //! HANDLE COPY IMAGE URL TO CLIPBOARD
  const [, copy] = useCopyToClipboard()

  const handleCopyUrl = (url: string) => () => {
    copy(url)
    toast('Đã sao chép', {
      position: 'top-right',
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Slide
    })
  }

  return (
    <div>
      <AdminImageFilter />
      <div className='mt-4'>
        {isFetching && (
          <div className='flex h-80 w-full items-center justify-center'>
            <LoadingRing />
          </div>
        )}
        {imagesData && (
          <div className='grid grid-cols-2 gap-2 tablet:grid-cols-3 desktop:grid-cols-4'>
            {imagesData?.data.data.map((image) => (
              <div className='col-span-1' key={image.id}>
                <ImageCard image={image} handleCopy={handleCopyUrl} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
