import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { ProductType } from 'src/types/product.type'
import { Fragment, memo, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { AppContext } from 'src/contexts/app.context'
import producImageApi from 'src/apis/productImage.api'
import ProductImageSlideShow from 'src/components/ProductCard/ProductImageSlideShow'
import { ProductImage } from 'src/types/productImage.type'
import userLikeProductApi from 'src/apis/userLikeProduct.api'
import { StoreContext } from 'src/contexts/store.context'
import ProductTag from 'src/components/ProductTag'
import mainPath from 'src/constants/path'

const MAXLENGTH = 3

interface Props {
  product: ProductType
  initialLoading?: boolean
  disableClick?: boolean
}

function ProductCard({ product, initialLoading, disableClick = false }: Props) {
  const { isAuthenticated } = useContext(AppContext)
  const { setWishlistIDs, wishlistIDs } = useContext(StoreContext)

  // const initialInWishlist = wishlistIDs.includes(product.id)

  const [isLikedByUser, setIsLikedByUser] = useState<boolean>(false)
  const [initialInWishlist, setInitialInWishlist] = useState<boolean>(false)

  useEffect(() => {
    setIsLikedByUser(wishlistIDs.includes(product.id))
  }, [product.id, wishlistIDs])

  const navigate = useNavigate()

  useEffect(() => {
    if (!initialLoading) {
      setInitialInWishlist(wishlistIDs.includes(product.id))
    }
  }, [initialLoading, product.id, wishlistIDs])

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
      handleClickItem(e)
    }
  }

  //! GET IMAGE LIST
  const productId = product.id
  const { data: imageListData, isLoading } = useQuery({
    queryKey: ['products', 'images', productId],
    queryFn: () => producImageApi.getImageList(productId as string),
    staleTime: 1000 * 60 * 3
  })
  const imageList = imageListData?.data.data

  //! HANDLE CHANGE IMAGE WHILE HOVERING
  const avatarUrl = product.avatar ? product.avatar.url : null
  const [hoveringImage, setHoveringImage] = useState<boolean>(false)
  const [imageListCarousel, setImageListCarousel] = useState<ProductImage[]>([])
  useEffect(() => {
    if (imageList) {
      setImageListCarousel(imageList.length > MAXLENGTH ? imageList?.slice(0, MAXLENGTH) : imageList.slice(0))
    }
  }, [imageList])

  const handleHoveringImage = () => {
    setHoveringImage(true)
  }

  const handleUnhoveringImage = () => {
    setHoveringImage(false)
  }

  //! HANDLE ENTER ITEM
  const queryClient = useQueryClient()
  const handleClickItem = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disableClick) {
      event.preventDefault()
    } else {
      navigate({ pathname: `${mainPath.store}/${generateNameId({ name: product.name, id: product.id })}` })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }
  }

  //! HANDLE LIKE ITEM
  const likeItem = () => {
    setIsLikedByUser(true)
    const newWishlistIDs = [...wishlistIDs, product.id]
    setWishlistIDs(newWishlistIDs)
  }

  const unlikeItem = () => {
    setIsLikedByUser(false)
    const IDindex = wishlistIDs.indexOf(product.id)
    const tempArray = wishlistIDs
    if (IDindex > -1) {
      tempArray.splice(IDindex, 1)
      setWishlistIDs(tempArray)
    }
  }

  const toggleLikeItem = () => {
    isLikedByUser && unlikeItem()
    !isLikedByUser && likeItem()
  }

  const unlikeItemMutation = useMutation({ mutationFn: userLikeProductApi.unlikeProduct })
  const likeItemMutation = useMutation({ mutationFn: userLikeProductApi.likeProduct })
  useEffect(() => {
    const updateLikeItem = setTimeout(() => {
      if (isLikedByUser && initialInWishlist === false) {
        likeItemMutation.mutate({ group_id: product.group.id })
      } else if (!isLikedByUser && initialInWishlist === true) {
        unlikeItemMutation.mutate({ group_id: product.group.id })
      }
    }, 1000)

    return () => clearTimeout(updateLikeItem)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLikedByUser])

  //! Check is discounted
  const isDiscounted = product.price < product.original_price

  return (
    <div
      className='flex w-full items-center justify-center pb-0 pt-2 duration-200 tablet:hover:pb-2 tablet:hover:pt-0'
      onMouseEnter={handleHoveringImage}
      onMouseLeave={handleUnhoveringImage}
    >
      <div className='relative w-full overflow-hidden rounded-xl bg-productLightBg pb-4 duration-200 dark:bg-productDarkBg'>
        <div className='relative w-full pt-[75%]'>
          <div className='absolute left-0 top-0 h-full w-full'>
            {/* {hoveringImage ? (
              <Fragment>
                <ProductImageSlideShow
                  imageList={imageListCarousel}
                  avatarUrl={avatarUrl}
                  isLoading={isLoading}
                  hovering={hoveringImage}
                />
                <button
                  className='absolute inset-0'
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                ></button>
              </Fragment>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt={product.name} className='absolute left-0 top-0 h-full w-full object-cover' />
            ) : (
              <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
              </div>
            )} */}
            <Fragment>
              <ProductImageSlideShow
                imageList={imageListCarousel}
                avatarUrl={avatarUrl}
                isLoading={isLoading}
                hovering={hoveringImage}
              />
              <button
                className='absolute inset-0'
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
              ></button>
            </Fragment>
          </div>
        </div>
        <div className='flex flex-col items-center justify-between space-x-1 space-y-1 overflow-hidden px-2 pt-2 tabletSmall:px-3 desktop:px-4 desktop:pt-4'>
          <button
            className='h-full justify-center overflow-hidden truncate text-center text-sm font-semibold uppercase text-darkText duration-200 hover:text-primaryColor dark:text-lightText dark:hover:text-primaryColor tabletSmall:text-base desktop:text-lg'
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
          >
            {product.name}
          </button>

          <div className='flex items-center space-x-2'>
            <span
              className={classNames(
                'text-xs font-semibold tabletSmall:text-sm desktop:text-base desktopLarge:text-lg',
                {
                  'line-through opacity-60': isDiscounted,
                  'text-haretaColor dark:text-haretaColor': !isDiscounted
                }
              )}
            >
              ${formatCurrency(product.original_price)}
            </span>
            {isDiscounted && (
              <span className='text-xs font-semibold text-haretaColor tabletSmall:text-sm desktop:text-base desktopLarge:text-lg'>
                ${formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
        {product.tag !== 0 && (
          <div className='absolute left-0 top-2'>
            <ProductTag tag={product.tag} />
          </div>
        )}
        {isAuthenticated && (
          <div className='absolute right-1 top-2'>
            <button className='flex items-center justify-center rounded-xl bg-black/50 p-2' onClick={toggleLikeItem}>
              <FontAwesomeIcon
                icon={faHeart}
                className={classNames('h-auto w-4 tablet:w-5  desktopLarge:w-6', {
                  'text-favouriteRed': isLikedByUser,
                  ' text-lightText': !isLikedByUser
                })}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ProductCard)
