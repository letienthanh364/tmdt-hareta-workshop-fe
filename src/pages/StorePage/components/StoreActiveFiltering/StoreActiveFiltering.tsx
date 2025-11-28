import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import omit from 'lodash/omit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import mainPath from 'src/constants/path'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'

export default function StoreActiveFiltering() {
  const queryConfig = useProductListQueryConfig()
  const { category, collection, type } = queryConfig

  const navigate = useNavigate()
  const handleClick = (field: string) => () => {
    const searchParams = createSearchParams(
      omit(
        {
          ...queryConfig
        },
        [`${field}`, 'page', 'limit']
      )
    )

    navigate({
      pathname: mainPath.store,
      search: searchParams.toString()
    })
  }

  return (
    <div className='grid grid-cols-3 gap-1.5 py-2 text-darkText/80 dark:text-lightText/80'>
      {category && (
        <div className='col-span-1'>
          <div className='flex items-center justify-between rounded-lg border border-black/40 px-2 py-1 dark:border-white/40'>
            <div className='truncate px-0.5 text-sm text-haretaColor tabletSmall:text-base'>{category}</div>
            <button
              className='flex items-center justify-center font-light text-darkText/40 dark:text-lightText/40'
              onClick={handleClick('category')}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
      {collection && (
        <div className='col-span-1'>
          <div className='flex items-center justify-between rounded-lg border border-black/40 px-2 py-1 dark:border-white/40'>
            <div className='truncate px-0.5 text-sm text-haretaColor tabletSmall:text-base'>{collection}</div>
            <button
              className='flex items-center justify-center font-light text-darkText/40 dark:text-lightText/40'
              onClick={handleClick('collection')}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
      {type && (
        <div className='col-span-1'>
          <div className='flex items-center justify-between rounded-lg border border-black/40 px-2 py-1 dark:border-white/40'>
            <div className='truncate px-0.5 text-sm text-haretaColor tabletSmall:text-base'>{type}</div>
            <button
              className='flex items-center justify-center font-light text-darkText/40 dark:text-lightText/40'
              onClick={handleClick('type')}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
