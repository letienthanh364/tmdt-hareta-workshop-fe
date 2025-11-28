import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import mainPath from 'src/constants/path'

interface Props {
  currentPage: string
}

export default function EmptyProductList({ currentPage }: Props) {
  //! Multi languages
  const { t } = useTranslation('utils')
  return (
    <div className='my-4 text-center text-2xl uppercase text-darkText dark:text-lightText'>
      <p className='w-full text-center text-lg capitalize text-haretaColor tablet:text-2xl desktopLarge:text-4xl'>
        {currentPage == 'store' && t('no products.store.title')}
        {currentPage == 'order' && t('no products.order.title')}
      </p>
      <div className='mt-4 flex w-full justify-center'>
        <img src='/images/cant-find-item.png' alt='No item' className='h-auto w-40 tablet:w-72 ' />
      </div>
      <p className='mt-4 w-full text-center text-sm tablet:text-lg desktop:text-xl desktopLarge:text-2xl'>
        {currentPage == 'store' && t('no products.store.message')}
        {currentPage == 'order' && t('no products.order.message')}
      </p>
      {currentPage == 'order' && (
        <p className='mt-4 w-full text-center text-sm tablet:text-lg desktop:text-xl desktopLarge:text-2xl'>
          {t('no products.order.go to')}{' '}
          <NavLink to={mainPath.store} className='text-unhoveringBg hover:text-hoveringBg'>
            {t('no products.order.store')}
          </NavLink>
          {` ${t('no products.order.now')}`}
        </p>
      )}
      {/* <div className='round-lg mt-8 tablet:mt-12 desktopLarge:mt-16'>
        <p className='mt-4 w-full text-left text-lg uppercase text-haretaColor tablet:text-xl desktopLarge:text-2xl'>
          You may also like
        </p>
      </div> */}
    </div>
  )
}
