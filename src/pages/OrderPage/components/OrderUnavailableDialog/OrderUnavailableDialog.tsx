import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import DialogPopup from 'src/components/DialogPopup'
import mainPath from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  handleConfirm: (failed: boolean) => () => void
}

export default function OrderUnavailableDialog({ isOpen, handleClose, handleConfirm }: Props) {
  const { theme } = useContext(AppContext)

  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <DialogPopup
      isOpen={isOpen}
      handleClose={handleClose}
      classNameWrapper='relative w-11/12 tabletSmall:w-9/12 tablet:w-8/12 max-w:lg transform overflow-hidden rounded-2xl py-6 px-4 align-middle shadow-xl transition-all'
      closeButton={false}
    >
      <div className={theme === 'dark' ? 'dark' : 'light'}>
        <div className='mb-4 text-center'>
          <FontAwesomeIcon
            icon={faXmark}
            className='text- h-auto w-8 rounded-full text-center text-red-600 tablet:w-10 desktop:w-12 desktopLarge:w-16'
          />
        </div>
        <p className='mt-6 text-center text-base font-bold uppercase leading-6 tabletSmall:text-lg tablet:text-xl desktopLarge:text-2xl'>
          {t('layout.YOUR ORDER WAS DENIDED')}
        </p>
        <div className='mt-4 flex flex-col items-center justify-center space-y-2 text-sm font-medium tablet:text-base desktopLarge:text-lg'>
          <p className='w-full text-left'>
            {t('denided order.Your order was denied due to ')}
            <span className='text-haretaColor'>{t('denided order.unavailable quantity')}</span>
            {t('denided order. of some items.')}
            {t('denided order.some items ')}
            <span className='text-haretaColor'>{t('denided order.have unavailable quantity.')}</span>
          </p>
          <p className='text-left'>
            {t(
              'denided order.This accident sometimes occurs when someone else had place an order including your desired items before you did. Therefore the quantity of those items in our storage could not meet your need.'
            )}
          </p>
          <p className='w-full text-left'>
            {t('denided order.Please ')}
            <span className='text-haretaColor'>{t('denided order.recheck')}</span>
            {t('denided order. the unavailable items and ')}
            <span className='text-haretaColor'>{t('denided order.adjust the quantity.')}</span>
          </p>
          <p className='text-center text-base font-semibold tablet:text-lg desktopLarge:text-xl'>
            {t('denided order.Sincerely apologies for this accident!')}
          </p>
        </div>
        <div className='mt-4 flex w-full items-center justify-center'>
          <Link
            to={mainPath.cart}
            className='rounded-lg bg-haretaColor px-4 py-2 font-medium hover:bg-primaryColor'
            onClick={handleConfirm(true)}
          >
            {t('denided order.Return to cart')}
          </Link>
        </div>
      </div>
    </DialogPopup>
  )
}
