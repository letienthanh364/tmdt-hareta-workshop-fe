import classNames from 'classnames'
import { useContext, useState } from 'react'

import AnimateChangeInHeight from 'src/components/AnimateChangeInHeight'
import useClickOutside from 'src/hooks/useClickOutside'
import { motion } from 'framer-motion'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'
import { createSearchParams, useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import { ProductTagList } from 'src/constants/itemTag'

// interface Props {
//   queryConfig: QueryConfig
// }

export default function StoreAsideSorter() {
  const { theme } = useContext(AppContext)
  const { visible, setVisible, ref } = useClickOutside(false)
  const [isOpening, setIsopening] = useState<boolean>(false)

  const queryConfig = useProductListQueryConfig()
  const { tag } = queryConfig
  const tagEnum = tag ? Number(tag) : 0

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

  //! Handle sorting
  const navigate = useNavigate()
  const handleChange = (tagIndex: number) => () => {
    if (tagIndex === 0) {
      navigate({
        pathname: mainPath.store,
        search: createSearchParams(
          omit(
            {
              ...queryConfig
            },
            ['page', 'limit', 'tag']
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
              tag: String(tagIndex)
            },
            ['page', 'limit']
          )
        ).toString()
      })
    }

    close()
  }

  //! Multi languages
  const { t } = useTranslation('store')
  const classNameForItem =
    'flex w-full flex-wrap items-center justify-center space-x-2 rounded-lg border border-black/20 px-1 py-0.5 capitalize dark:border-white/20 desktop:px-2'

  return (
    <div
      className={classNames(
        'grid h-full grid-cols-12 space-x-2 overflow-hidden rounded-lg bg-sidebarItemLight px-3 py-2 text-base font-medium duration-200 dark:bg-sidebarItemDark desktop:text-lg'
      )}
    >
      <p className='col-span-5 flex h-6 items-center text-left text-xs font-medium uppercase text-darkText duration-200 dark:text-lightText desktop:h-7 desktop:text-base desktopLarge:text-lg'>
        {t('aside filter.sort by')}
      </p>
      <div className='col-span-7 items-center' ref={ref}>
        <button
          className={classNames(
            'flex w-full items-center justify-center rounded-xl py-0.5 text-sm font-medium capitalize text-darkText duration-200 desktop:px-3 desktop:text-base',
            {
              'rounded-b-none border-x border-t border-black/20 text-darkText duration-200 dark:border-white/20 dark:text-lightText':
                visible,
              'bg-unhoveringBg hover:bg-hoveringBg': !visible
            }
          )}
          onClick={toggleOpenClose}
        >
          {tagEnum == 0 && t('aside filter.newest')}
          {tagEnum == 1 && t('aside filter.top seller')}
          {tagEnum == 2 && t('aside filter.signature')}
          {tagEnum == 3 && t('aside filter.favourite')}
        </button>
        <AnimateChangeInHeight>
          {visible && isOpening && (
            <motion.div
              className='gap-2 rounded-xl rounded-t-none border-x border-b border-black/20 px-1 py-4 dark:border-white/20 desktop:px-2 desktopLarge:px-3'
              initial={{ opacity: 1, y: '-40%', backgroundColor: theme === 'dark' ? '#1d1d22' : '#e9e9e8' }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundColor: theme === 'dark' ? '#1d1d22' : '#e9e9e8'
              }}
              exit={{ opacity: 1, y: '-40%', backgroundColor: theme === 'dark' ? '#1d1d22' : '#e9e9e8' }}
              transition={{ duration: 0.2 }}
            >
              <div className='flex grow flex-col space-y-2 text-xs desktop:text-base'>
                {ProductTagList.map((tag, index) => (
                  <button
                    key={index}
                    onClick={handleChange(index)}
                    className={classNames(classNameForItem, {
                      'text-darkText hover:bg-[#d6d6d5] dark:text-lightText dark:hover:bg-[#2c2c32]': tagEnum !== index,
                      'bg-primaryColor text-darkText': tagEnum === index
                    })}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimateChangeInHeight>
      </div>
    </div>
  )
}
