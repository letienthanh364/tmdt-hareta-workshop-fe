import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProductImage } from 'src/types/productImage.type'
import { Fragment } from 'react'
import { Slide } from 'react-slideshow-image'

interface Props {
  imageList: ProductImage[]
  avatarUrl: string | null
  isLoading?: boolean
  customClassname?: string
  hovering: boolean
}

//! Responesive
const responsiveSettings = [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  },
  {
    breakpoint: 464,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  },
  {
    breakpoint: 0,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }
]

export default function ProductImageSlideShow({
  imageList,
  avatarUrl,
  customClassname = 'relative  w-full pt-[75%]',
  hovering
}: Props) {
  return (
    <Fragment>
      {imageList.length == 1 && (
        <div className='absolute left-0 top-0 h-full w-full'>
          {avatarUrl ? (
            <img src={avatarUrl} alt='' className='absolute left-0 top-0 h-full w-full object-cover' />
          ) : (
            <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
              <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
            </div>
          )}
        </div>
      )}
      {imageList.length > 1 && (
        <Slide
          responsive={responsiveSettings}
          defaultIndex={0}
          transitionDuration={500}
          arrows={false}
          indicators={false}
          autoplay={hovering}
          duration={1000}
        >
          {imageList.map((image) => {
            const imageURL = image.image ? image.image.url : null
            return (
              <div className={customClassname} key={image.id}>
                {imageURL ? (
                  <img src={imageURL} alt={image.color} className='absolute left-0 top-0 h-full w-full object-cover' />
                ) : (
                  <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center object-cover'>
                    <FontAwesomeIcon icon={faTriangleExclamation} fontSize={60} />
                  </div>
                )}
              </div>
            )
          })}
        </Slide>
      )}
    </Fragment>
  )
}
