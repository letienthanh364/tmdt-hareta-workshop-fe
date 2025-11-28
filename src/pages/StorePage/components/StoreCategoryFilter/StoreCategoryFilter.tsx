import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import AnimateChangeInHeight from 'src/components/AnimateChangeInHeight'
import useClickOutside from 'src/hooks/useClickOutside'

import useQueryParams from 'src/hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { createSearchParams, useNavigate } from 'react-router-dom'
import mainPath from 'src/constants/path'
import omit from 'lodash/omit'
import classNames from 'classnames'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'

interface Props {
  isMobile?: boolean
  setMobileFilterOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StoreCategoryFilter({ setMobileFilterOpen, isMobile = false }: Props) {
  const { theme } = useContext(AppContext)
  const { visible, setVisible, ref } = useClickOutside(false)
  const [isOpening, setIsopening] = useState<boolean>(false)

  const queryConfig = useProductListQueryConfig()
  const { category, collection, type } = queryConfig

  //! Multi languages
  const { t } = useTranslation('store')

  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['categories', queryParams],
    queryFn: () => {
      return productApi.getFilteringList('category', '', collection, type)
    }
  })

  const open = () => {
    setVisible(true)
    setIsopening(true)
  }
  const close = () => {
    setVisible(false)
    setIsopening(false)
  }
  const toggleOpenClose = () => {
    if ((isOpening && !visible) || (!isOpening && !visible)) open()
    else close()
  }

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const selectedCategory = String((e.target as HTMLInputElement).innerText)
    close()
    if (isMobile && setMobileFilterOpen) {
      setMobileFilterOpen(false)
    }

    if (selectedCategory.toUpperCase() === t('aside filter.all').toUpperCase()) {
      navigate({
        pathname: mainPath.store,
        search: createSearchParams(
          omit(
            {
              ...queryConfig
            },
            ['category', 'page', 'limit']
          )
        ).toString()
      })
    } else {
      navigate({
        pathname: mainPath.store,
        search: createSearchParams(
          omit(
            {
              ...queryConfig,
              category: selectedCategory
            },
            ['page', 'limit']
          )
        ).toString()
      })
    }
  }

  return (
    <div
      className='overflow-hidden rounded-md bg-barLightBg p-2 outline outline-1 outline-black/20 duration-200 dark:bg-barDarkBg dark:outline-white/20'
      ref={ref}
    >
      <button className='flex w-full flex-col items-start text-sm tabletSmall:text-base' onClick={toggleOpenClose}>
        <div
          className={classNames(
            'flex items-center capitalize text-darkText/80 hover:text-primaryColor dark:text-lightText/80 dark:hover:text-primaryColor',
            {
              'mb-2': visible || category
            }
          )}
        >
          {t('aside filter.category')}
          {(!visible || !isOpening) && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='ml-1 h-3 w-3 desktop:h-4 desktop:w-4'
            >
              <path
                fillRule='evenodd'
                d='M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z'
                clipRule='evenodd'
              />
            </svg>
          )}
          {visible && isOpening && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='ml-1 h-3 w-3 desktop:h-4 desktop:w-4'
            >
              <path
                fillRule='evenodd'
                d='M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
        {category && (
          <div
            className={classNames(
              'flex min-h-[36px] w-full select-none items-center justify-start truncate rounded-t-md border border-black/20 bg-sidebarItemLight px-2 py-1 text-sm capitalize text-darkText duration-200 dark:border-white/20 dark:bg-sidebarItemDark dark:text-lightText tabletSmall:text-base desktop:text-lg',
              {
                'rounded-b-md': !isOpening || !visible
              }
            )}
          >
            {category}
          </div>
        )}
      </button>
      <AnimateChangeInHeight>
        {visible && isOpening && (
          <motion.div
            className={classNames(
              'max-h-32 overflow-auto overscroll-contain rounded-b-md border-x border-b border-black/20 text-sm text-darkText dark:border-white/20 dark:text-lightText tabletSmall:text-base desktop:text-lg',
              {
                'rounded-t-md border-t': !category
              }
            )}
            initial={{ opacity: 0, y: '-40%' }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundColor: theme === 'dark' ? '#2c2c32' : '#fbfbff'
            }}
            exit={{ opacity: 0, y: '-40%' }}
            transition={{ duration: 0.2 }}
          >
            <div className='flex flex-col'>
              <button
                className='flex items-center justify-start px-2 py-1 capitalize hover:text-primaryColor dark:hover:text-primaryColor'
                onClick={handleChange}
              >
                {t('aside filter.all')}
              </button>
              {data &&
                data.data.data.map((name, index) => (
                  <button
                    className={classNames(
                      'flex items-center justify-start px-2 py-1 capitalize hover:text-primaryColor dark:hover:text-primaryColor'
                    )}
                    key={index}
                    onClick={handleChange}
                  >
                    {name}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimateChangeInHeight>
    </div>
  )
}
