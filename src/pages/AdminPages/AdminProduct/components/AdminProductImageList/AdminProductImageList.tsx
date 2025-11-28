import { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { AdminContext } from 'src/contexts/admin.context'
import { ProductImage } from 'src/types/productImage.type'
import producImageApi from 'src/apis/productImage.api'
import LoadingRing from 'src/components/LoadingRing'

export default function AdminProductImageList() {
  const { currentProduct, setCurrentImage, currentImage } = useContext(AdminContext)

  //? GET IMAGE LIST
  const {
    data: itemImageListData,
    isFetched,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['products', currentProduct?.id || '', 'images'],
    queryFn: () => producImageApi.getImageList(currentProduct?.id as string),
    enabled: Boolean(currentProduct),
    staleTime: 1000 * 60 * 3
  })
  const imageList = itemImageListData?.data.data
  // const imageList = useMemo(() => itemImageListData?.data.data, [itemImageListData?.data.data])
  useEffect(() => {
    if (currentProduct) {
      refetch()
    }
  }, [currentProduct, refetch])

  //? HANDLE CHOOSE IMAGE
  const handleSelectImage = (image: ProductImage) => () => {
    setCurrentImage(image)
  }

  return (
    <div className='relative rounded-lg border border-white/40 bg-black p-4'>
      <div className='flex w-full flex-col items-center justify-center space-y-4'>
        <p className=' text-center text-lg font-semibold uppercase text-white desktop:text-xl'>Danh sách hình ảnh</p>
        <div className='h-60 w-full overflow-scroll rounded-lg border border-white/40 bg-[#202020]'>
          {!currentProduct && (
            <div className='inset-0 flex h-full w-full cursor-not-allowed items-center justify-center text-2xl uppercase'>
              Chọn 1 sản phẩm
            </div>
          )}
          {isFetching && (
            <div className='inset-0 flex h-full w-full items-center justify-center bg-black/50'>
              <LoadingRing />
            </div>
          )}
          {isFetched && (
            <div className='m-2 grid grid-cols-4 gap-2'>
              {imageList?.map((image) => {
                const isActive = image.id === currentImage?.id
                return (
                  <div
                    key={image.id}
                    className={classNames('col-span-1 h-min rounded-xl p-1 outline outline-1 outline-offset-0', {
                      'outline-2 outline-haretaColor': isActive,
                      'outline-haretaColor/40 ': !isActive
                    })}
                  >
                    <button
                      className='relative flex w-full items-center justify-center pt-[75%]'
                      onClick={handleSelectImage(image)}
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
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
