import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useState } from 'react'
import { Slide, SlideProps } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

const DEFAULT_INDEX = 0

//! Styles
const arrowWrapperStyle = 'rounded-full p-4 bg-black opacity-70 duration-200 hover:opacity-100'
const arrowStyle = 'h-4 w-4 tablet:h-5 tablet:w-5 desktop:h-6 desktop:w-6 text-white'

export default function CustomSlideShow(props: SlideProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(DEFAULT_INDEX)

  const { children, ...rest } = props
  return (
    <Slide
      defaultIndex={DEFAULT_INDEX}
      prevArrow={
        <button className={classNames('ml-4', arrowWrapperStyle)}>
          <FontAwesomeIcon className={arrowStyle} icon={faChevronLeft} />
        </button>
      }
      nextArrow={
        <button className={classNames('mr-4', arrowWrapperStyle)}>
          <FontAwesomeIcon className={arrowStyle} icon={faChevronRight} />
        </button>
      }
      onChange={(_, to) => {
        setCurrentIndex(to)
      }}
      indicators={(index) => (
        <div className={classNames('flex w-10 items-center justify-center')}>
          <div
            className={classNames('h-1.5 w-8 rounded-lg duration-200', {
              'bg-hoveringBg dark:bg-hoveringBg': index == currentIndex,
              'bg-unhoveringBg/60 hover:bg-hoveringBg': index != currentIndex
            })}
          />
        </div>
      )}
      transitionDuration={500}
      {...rest}
    >
      {children}
    </Slide>
  )
}
