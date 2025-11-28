import { Fragment, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useClickOutside from 'src/hooks/useClickOutside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons'
import PriceRange from '../StorePriceRange'
import { useNavigate } from 'react-router-dom'
import mainPath from 'src/constants/path'
import classNames from 'classnames'
import { ProductListQueryConfig } from 'src/hooks/useProductListQueryConfig'
import { AppContext } from 'src/contexts/app.context'
import { useTranslation } from 'react-i18next'
import StoreCategoryFilter from '../StoreCategoryFilter'
import StoreCollectionFilter from '../StoreCollectionFilter'
import StoreTypeFilter from '../StoreTypeFilter'

interface Props {
  queryConfig: ProductListQueryConfig
}

export default function StoreMobileFilter({ queryConfig }: Props) {
  const { theme } = useContext(AppContext)
  const { visible, setVisible, ref } = useClickOutside(false)

  const { category, collection, type } = queryConfig

  const isFiltering = category || collection || type
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const open = () => {
    setVisible(true)
    setIsOpen(true)
  }
  const close = () => {
    setVisible(false)
    setIsOpen(false)
  }

  const navigate = useNavigate()
  const handleClear = () => {
    close()

    navigate({
      pathname: mainPath.store
    })
  }

  //! Multi languages
  const { t } = useTranslation('store')

  return (
    <Fragment>
      <button
        onClick={open}
        className='group relative col-span-1 flex items-center text-darkText hover:text-haretaColor dark:text-lightText dark:hover:text-haretaColor '
      >
        <FontAwesomeIcon
          icon={faFilter}
          className='mr-1 h-6 w-6 text-darkText group-hover:text-haretaColor dark:text-lightText dark:group-hover:text-haretaColor'
        />
      </button>
      <AnimatePresence>
        {visible && isOpen && (
          <Fragment>
            <motion.div
              className='fixed inset-0 '
              initial={{ opacity: 0, backgroundColor: 'black' }}
              animate={{
                opacity: 0.4
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className='fixed bottom-0 right-0 z-10  h-full w-[60%] rounded-l-md px-2 py-12 shadow-sm'
              initial={{ opacity: 0, x: '20%' }}
              animate={{
                opacity: 1,
                x: 0,
                backgroundColor: theme === 'dark' ? '#1d1d22' : '#fbfbff',
                color: theme === 'dark' ? '#eeeeee' : '#111111'
              }}
              exit={{ opacity: 0, x: '20%' }}
              transition={{ duration: 0.3 }}
              ref={ref}
            >
              <div className='rounded-md border border-black/20 dark:border-white/20'>
                <PriceRange />
              </div>
              <div className='mt-12 w-full '>
                <div className='flex w-full flex-col space-y-2'>
                  <StoreCategoryFilter />
                  <StoreCollectionFilter />
                  <StoreTypeFilter />
                </div>
                <div className='flex w-full items-center justify-end'>
                  <button
                    onClick={handleClear}
                    disabled={isFiltering ? false : true}
                    className={classNames(
                      'text-alerborder-alertRed mt-4 flex items-center justify-center rounded-md border border-alertRed px-4 py-1 text-sm duration-200 tabletSmall:text-base ',
                      { 'opacity-60': !isFiltering }
                    )}
                  >
                    {t('aside filter.clear')}
                  </button>
                </div>
              </div>
              <button className='absolute left-2 top-2 text-darkText dark:text-lightText' onClick={close}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>
    </Fragment>
  )
}
