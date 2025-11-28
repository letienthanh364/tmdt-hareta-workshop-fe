import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DialogPopup from 'src/components/DialogPopup'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  isOpen: boolean
  handleClose: () => void
  errorMessage: string
}

export default function OrderErrorDialog({ isOpen, handleClose, errorMessage }: Props) {
  const { theme } = useContext(AppContext)

  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <DialogPopup
      isOpen={isOpen}
      handleClose={handleClose}
      classNameWrapper='relative w-10/12 tablet:w-8/12 max-w-lg transform overflow-hidden rounded-2xl py-6 px-4 align-middle shadow-xl transition-all'
    >
      <div className={classNames('space-y-4', theme === 'dark' ? 'dark' : 'light')}>
        <div className='mb-4 text-center'>
          <FontAwesomeIcon
            icon={faXmark}
            className='text- h-auto w-8 rounded-full text-center text-alertRed tablet:w-10 desktop:w-12 desktopLarge:w-16'
          />
        </div>
        <p className='mt-6 text-center text-base font-bold uppercase leading-6 tabletSmall:text-lg tablet:text-xl desktopLarge:text-2xl'>
          {t('denided order.Cannot place order')}
        </p>

        <p className='font-semibold'>{errorMessage || t('error.Something went wrong')}</p>
        <p className='font-semibold'>{t('denided order.Please try again')}</p>

        <div className='flex w-full items-center justify-center'>
          <button
            className='rounded-2xl bg-haretaColor px-4 py-2 font-medium text-darkText hover:bg-primaryColor'
            onClick={handleClose}
          >
            OK
          </button>
        </div>
      </div>
    </DialogPopup>
  )
}
