import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import omit from 'lodash/omit'
import { Fragment, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { ProductTagList } from 'src/constants/itemTag'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'

import useClickOutside from 'src/hooks/useClickOutside'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'

export default function StoreMobileSorter() {
  const { theme } = useContext(AppContext)
  const { visible, setVisible, ref } = useClickOutside(false)

  const queryConfig = useProductListQueryConfig()
  const { tag } = queryConfig
  const tagEnum = tag ? Number(tag) : 0

  const open = () => {
    setVisible(true)
  }
  const close = () => {
    setVisible(false)
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

  return (
    <Fragment>
      <button
        onClick={open}
        className='flex w-[60%] items-center justify-center rounded-md bg-haretaColor px-4 py-1 text-sm font-medium text-darkText tabletSmall:text-base'
      >
        {tagEnum == 0 && t('aside filter.newest')}
        {tagEnum == 1 && t('aside filter.top seller')}
        {tagEnum == 2 && t('aside filter.signature')}
        {tagEnum == 3 && t('aside filter.favourite')}
      </button>
      <AnimatePresence>
        {visible && (
          <Fragment>
            <motion.div
              className='fixed inset-0'
              initial={{ opacity: 0, backgroundColor: 'black' }}
              animate={{
                opacity: 0.4
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className='fixed bottom-0 left-0 z-10 flex h-full w-[45%] flex-col justify-center self-center rounded-lg rounded-l-none py-2 shadow-sm'
              initial={{ opacity: 0, x: '-20%' }}
              animate={{
                opacity: 1,
                x: 0,
                backgroundColor: theme === 'dark' ? '#1d1d22' : '#fbfbff',
                color: theme === 'dark' ? '#eeeeee' : '#111111'
              }}
              exit={{ opacity: 0, x: '-20%' }}
              transition={{ duration: 0.3 }}
              ref={ref}
            >
              <p className='flex items-center justify-center text-lg font-medium uppercase'>
                {t('aside filter.sort by')}:
              </p>
              <div className='flex flex-col space-y-2 px-4 py-2 text-sm text-darkText/80 dark:text-lightText/80 desktop:text-base'>
                {ProductTagList.map((tag, index) => (
                  <button
                    key={index}
                    onClick={handleChange(index)}
                    className={classNames(
                      'flex w-full items-center justify-center rounded-lg px-3 py-1 font-medium text-darkText ',
                      {
                        'bg-primaryColor': tagEnum === index,
                        'bg-haretaColor': tagEnum !== index
                      }
                    )}
                  >
                    <p>{tag.name}</p>
                  </button>
                ))}
              </div>
              <button className='absolute right-2 top-2 text-darkText dark:text-lightText' onClick={close}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>
    </Fragment>
  )
}
