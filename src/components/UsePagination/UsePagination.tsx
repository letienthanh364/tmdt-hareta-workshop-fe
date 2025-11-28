import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Link, createSearchParams } from 'react-router-dom'
import mainPath from 'src/constants/path'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: {
    [k: string]: string
  }
  totalPage: number
  isMobile?: boolean
}

//! Style
const indexNumberStyle =
  'mx-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border px-2 py-2 text-sm shadow-sm hover:border-primaryColor dark:hover:border-primaryColor desktop:mx-2 desktop:h-8 desktop:w-8 desktop:text-base'
const activeArrowStyle =
  'group mx-2 flex cursor-pointer items-center space-x-1 rounded-xl border border-darkText px-3  py-1 text-sm text-darkText shadow-sm hover:border-primaryColor  hover:text-primaryColor dark:border-lightText dark:text-lightText dark:hover:border-primaryColor dark:hover:text-primaryColor desktop:text-base'
const inactiveArrowStyle =
  'group mx-2 flex cursor-not-allowed items-center space-x-1 rounded-xl border border-darkText px-3  py-1 text-sm text-darkText opacity-40 shadow-sm dark:border-lightText dark:text-lightText desktop:text-base'

export default function UsePagination({ queryConfig, totalPage, isMobile }: Props) {
  const currentPage = Number(queryConfig.page)
  const RANGE = isMobile ? 1 : 2

  //! Multi languages
  const { t } = useTranslation('utils')

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span
            className='mx-1 rounded bg-transparent px-2 py-2 tracking-[4px] text-darkText shadow-sm dark:text-lightText '
            key={index}
          >
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span
            className='mx-1 rounded bg-transparent px-2 py-2 tracking-[4px] text-darkText shadow-sm dark:text-lightText '
            key={index}
          >
            ...
          </span>
        )
      }
      return null
    }
    return Array(totalPage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (currentPage <= RANGE * 2 + 1 && pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
          return renderDotAfter(index)
        } else if (currentPage > RANGE * 2 + 1 && currentPage < totalPage - RANGE * 2) {
          if (pageNumber < currentPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currentPage + RANGE && pageNumber < totalPage - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currentPage >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < currentPage - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            to={{
              pathname: mainPath.store,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames(indexNumberStyle, {
              'border-transparent bg-hoveringBg text-darkText dark:text-darkText': pageNumber === currentPage,
              'border-textDark dark:border-textLight text-darkText dark:text-lightText ': pageNumber !== currentPage
            })}
            key={index}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  if (totalPage === 0) return
  return (
    <div className='mt-6 flex flex-wrap items-center justify-center'>
      {currentPage > 1 ? (
        <Link
          to={{
            pathname: mainPath.store,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage - 1).toString()
            }).toString()
          }}
          className={activeArrowStyle}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            className='py-1 text-darkText group-hover:text-primaryColor dark:text-lightText dark:group-hover:text-primaryColor'
          />
          {!isMobile && <p>{t('pagination.prev')}</p>}
        </Link>
      ) : (
        <span className={inactiveArrowStyle}>
          <FontAwesomeIcon icon={faAngleLeft} className='py-1 text-darkText dark:text-lightText' />
          {!isMobile && <p>{t('pagination.prev')}</p>}
        </span>
      )}

      {renderPagination()}

      {currentPage < totalPage ? (
        <Link
          to={{
            pathname: mainPath.store,
            search: createSearchParams({
              ...queryConfig,
              page: (currentPage + 1).toString()
            }).toString()
          }}
          className={activeArrowStyle}
        >
          {!isMobile && <p>{t('pagination.next')}</p>}
          <FontAwesomeIcon
            icon={faAngleRight}
            className='py-1 text-darkText group-hover:text-primaryColor dark:text-lightText dark:group-hover:text-primaryColor'
          />
        </Link>
      ) : (
        <span className={inactiveArrowStyle}>
          {!isMobile && <p>{t('pagination.next')}</p>}
          <FontAwesomeIcon icon={faAngleRight} className='py-1 text-darkText dark:text-lightText' />
        </span>
      )}
    </div>
  )
}
