import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import mainPath from 'src/constants/path'
import useProductListQueryConfig from 'src/hooks/useProductListQueryConfig'
import StoreTypeFilter from '../StoreTypeFilter'
import StoreCategoryFilter from '../StoreCategoryFilter'
import StoreCollectionFilter from '../StoreCollectionFilter'

export default function StoreAsideFilter() {
  const navigate = useNavigate()
  const { category, collection, type } = useProductListQueryConfig()

  const isFiltering = category || collection || type

  const handleClear = () => {
    navigate({
      pathname: mainPath.store
    })
  }

  //! Multi languages
  const { t } = useTranslation('store')

  return (
    <div className='rounded-lg bg-sidebarItemLight px-3 py-2 duration-200 dark:bg-sidebarItemDark'>
      <div className='flex items-center space-x-2 text-base font-medium uppercase text-darkText duration-200 dark:text-lightText desktop:text-lg'>
        <p className=''>{t('aside filter.filter')}</p>
      </div>
      <div className='mt-2 flex flex-col space-y-2'>
        <StoreCategoryFilter />
        <StoreCollectionFilter />
        <StoreTypeFilter />
      </div>

      <div className='mt-4'>
        <button
          onClick={handleClear}
          disabled={isFiltering ? false : true}
          className={classNames(
            'flex w-full shrink-0 items-center justify-start rounded-md bg-[#e8e8e8] px-4 py-2 font-semibold capitalize text-alertRed  outline outline-1 outline-transparent duration-200 disabled:cursor-not-allowed dark:bg-[#101010]',
            { 'opacity-40': !isFiltering },
            {
              'hover:outline-alertRed': isFiltering
            }
          )}
        >
          {t('aside filter.clear')}
        </button>
      </div>
    </div>
  )
}
