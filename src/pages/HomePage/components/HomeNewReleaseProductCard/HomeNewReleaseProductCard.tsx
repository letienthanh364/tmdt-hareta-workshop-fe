import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Skeleton } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import producImageApi from 'src/apis/productImage.api'
import mainPath from 'src/constants/path'
import { useViewport } from 'src/hooks/useViewport'
import { ProductType } from 'src/types/product.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const LIMIT = 5

interface Props {
  product: ProductType
}

export default function HomeNewReleaseProductCard({ product }: Props) {
  //! Logic to disable click on dragging
  const [isDragging, setIsDragging] = useState(false)
  const [mouseDown, setMouseDown] = useState(false)

  const handleMouseDown = () => {
    setMouseDown(true)
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) {
      event.preventDefault()
    }
    setMouseDown(false)
  }

  const handleMouseMove = () => {
    if (mouseDown) {
      setIsDragging(true)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) {
      e.preventDefault()
      setIsDragging(false)
    } else {
      handleClickItem()
    }
  }

  //! IS MOBILE
  const viewPort = useViewport()
  const isMobile = viewPort.width < 768

  const avatarUrl = product.avatar ? product.avatar.url : null
  //! GET IMAGE LIST
  const productId = product.id
  const { data: imageListData, isFetching } = useQuery({
    queryKey: ['products', 'images', productId],
    queryFn: () => producImageApi.getImageList(productId as string),
    staleTime: 1000 * 60 * 3
  })
  const imageList = imageListData?.data.data || []
  const displayImages = imageList?.length > LIMIT ? imageList.slice(1, LIMIT) : imageList.slice(1, imageList.length)

  //! HANDLE ENTER ITEM
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const handleClickItem = () => {
    navigate({ pathname: `${mainPath.store}/${generateNameId({ name: product.name, id: product.id })}` })
    queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  }

  //! Check discounted
  const isDiscounted = product.price < product.original_price

  //! styles
  const tagClassname =
    'rounded-xl border border-black/60 col-span-1 text-center overflow-hidden px-2 tablet:px-4 py-1 text-xs mobileLarge:text-sm font-medium capitalize dark:border-white/60 tabletSmall:text-base desktop:text-lg desktopLarge:text-xl'

  return (
    <button
      className='w-full items-start bg-lightColor900 text-left duration-200 hover:bg-lightColor700 dark:bg-darkColor900 dark:hover:bg-darkColor700'
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className='grid w-full grid-cols-1 gap-2 p-2 tablet:grid-cols-3 tablet:p-4 tablet:px-8 tablet:py-6 desktop:py-8 desktopLarge:gap-4 desktopLarge:px-12 desktopLarge:py-10'>
        <div className='col-span-1 min-h-full'>
          <div className='relative w-full pt-[60%] tablet:pt-[80%]'>
            <div className='absolute left-0 top-0 h-full w-full'>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={product.name}
                  className='pointer-events-none absolute left-0 top-0 h-full w-full object-cover'
                />
              ) : (
                <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                  <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='col-span-1 min-h-full tablet:col-span-2'>
          <div className='flex h-full flex-col justify-between pl-2 tabletSmall:pl-8 desktop:pl-10 desktopLarge:pl-14'>
            <div className='flex flex-col items-center justify-between space-y-2 overflow-hidden'>
              <p className='h-full w-full justify-center overflow-hidden truncate text-center text-2xl font-semibold uppercase text-darkText duration-200 dark:text-lightText desktop:text-3xl desktopLarge:text-4xl'>
                {product.name}
              </p>

              <div className='flex w-full justify-center space-x-4 font-semibold tablet:text-xl desktop:text-2xl'>
                <span
                  className={classNames('', {
                    'text-haretaColor dark:text-haretaColor': !isDiscounted,
                    'line-through opacity-60': isDiscounted
                  })}
                >
                  ${formatCurrency(product.original_price)}
                </span>
                {isDiscounted && (
                  <span className='text-haretaColor dark:text-haretaColor'>${formatCurrency(product.price)}</span>
                )}
              </div>

              <div className=' grid grid-cols-3 gap-2 tablet:flex tablet:justify-center '>
                <span className={tagClassname}>{product.category}</span>

                <span className={tagClassname}>{product.collection}</span>

                <span className={tagClassname}>{product.type}</span>
              </div>
            </div>

            {!isMobile && (
              <div className='mt-4 w-full overflow-auto rounded-lg px-2 '>
                <div className='grid w-full grid-cols-4 gap-4 desktop:gap-8'>
                  {isFetching &&
                    Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <div className='col-span-1' key={index}>
                          <div className='relative w-full overflow-hidden rounded-lg bg-white/10 pt-[100%]'>
                            <Skeleton
                              variant='rounded'
                              className='absolute left-0 top-0'
                              width={'100%'}
                              height={'100%'}
                            />
                          </div>
                        </div>
                      ))}
                  {imageListData &&
                    !isFetching &&
                    displayImages.map((image) => {
                      return (
                        <div className='col-span-1' key={image.id}>
                          <div className='relative w-full overflow-hidden rounded-xl pt-[100%]'>
                            <img
                              src={image.image ? image.image.url : ''}
                              alt={product.name}
                              className='pointer-events-none absolute left-0 top-0 h-full w-full object-cover'
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
