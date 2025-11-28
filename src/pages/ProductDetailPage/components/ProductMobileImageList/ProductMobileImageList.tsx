import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import producImageApi from 'src/apis/productImage.api'
import { ProductType } from 'src/types/product.type'
import { ProductImageWithIndex } from '../../ProductDetailPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import LoadingRing from 'src/components/LoadingRing'

interface Props {
  productID: string
  product: ProductType
}

export default function ProductMobileImageList(props: Props) {
  const { productID, product } = props

  //! GET IMAGE LIST
  const { data: productImages, isFetching } = useQuery({
    queryKey: ['products', 'images', productID],
    queryFn: () => producImageApi.getImageList(productID as string)
  })

  //! HANDLE IMAGE LIST
  const [activeImage, setActiveImage] = useState<ProductImageWithIndex>()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 4])
  const imagesData = productImages?.data.data
  const imagesWithIndex = useMemo(
    () =>
      imagesData
        ? imagesData.map((image, index) => {
            return { ...image, index: index }
          })
        : [],
    [imagesData]
  )

  const currentImageList = useMemo(
    () => (imagesWithIndex ? imagesWithIndex.slice(...currentIndexImages) : []),
    [currentIndexImages, imagesWithIndex]
  )

  useEffect(() => {
    setActiveImage(imagesWithIndex[0])
    setActiveImageIndex(0)
    setCurrentIndexImages([0, 4])
  }, [imagesWithIndex])

  const nextImageList = () => {
    setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    if (currentIndexImages[0] === activeImageIndex) {
      setActiveImage(imagesWithIndex[activeImageIndex + 1])
      setActiveImageIndex((prev) => prev + 1)
    }
  }

  const previousImageList = () => {
    setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    if (currentIndexImages[1] - 1 === activeImageIndex) {
      setActiveImage(imagesWithIndex[activeImageIndex - 1])
      setActiveImageIndex((prev) => prev - 1)
    }
  }

  const handleChoosingImage = (image: ProductImageWithIndex) => () => {
    setActiveImage(image)
    setActiveImageIndex(image.index)
  }

  return (
    <div className='relative'>
      <div className='relative w-full overflow-hidden pt-[75%]'>
        {isFetching && (
          <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
            <LoadingRing />
          </div>
        )}
        {!isFetching &&
          activeImage &&
          (activeImage?.image ? (
            <img
              src={activeImage.image.url}
              alt={product.name}
              className='pointer-events-none absolute left-0 top-0 h-full w-full object-scale-down'
            />
          ) : (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <FontAwesomeIcon icon={faTriangleExclamation} fontSize={120} />
            </div>
          ))}
      </div>
      <div className='mt-3 w-full px-2'>
        <div className='relative flex select-none justify-center rounded-md bg-black/40'>
          <div className='grid w-full grid-cols-4 gap-2 px-4 py-1'>
            {currentImageList.map((image) => {
              const isActive = image === activeImage
              return (
                <div className='col-span-1' key={image.id}>
                  <button onClick={handleChoosingImage(image)} className='relative w-full pt-[75%]'>
                    <img
                      src={image.image ? image.image.url : ''}
                      alt={product.name}
                      className='absolute left-0 top-0 h-full w-full object-scale-down'
                    />
                    {isActive && (
                      <div className='absolute inset-0 rounded-lg border-2 border-haretaColor dark:border-haretaColor' />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
          {imagesWithIndex.length > 5 && currentIndexImages[0] !== 0 && (
            <button
              className='absolute left-0 top-1/2 -translate-y-1/2 justify-start rounded-md bg-black/60 px-1 py-2 text-lightText'
              onClick={previousImageList}
            >
              <FontAwesomeIcon icon={faChevronLeft} className='h-auto w-3 tabletSmall:w-4' />
            </button>
          )}

          {imagesWithIndex.length > 5 && currentIndexImages[1] !== imagesWithIndex.length && (
            <button
              className='absolute right-0 top-1/2 -translate-y-1/2 rounded-md bg-black/60 px-1 py-2 text-lightText'
              onClick={nextImageList}
            >
              <FontAwesomeIcon icon={faChevronRight} className='h-auto w-3 tabletSmall:w-4' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
